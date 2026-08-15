from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import bcrypt
from collections import OrderedDict
from contextlib import contextmanager
from html import escape
import jwt
import json
import logging
import smtplib
import ssl
import threading
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request as UrlRequest, urlopen
from datetime import datetime, timedelta, timezone
from email.message import EmailMessage
from email.utils import formataddr, formatdate
from zoneinfo import ZoneInfo

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Query, Request

from core.database import engine, SessionLocal, Base
from core.config import settings
from core import models, schemas

logger = logging.getLogger(__name__)
IST_TIMEZONE = ZoneInfo("Asia/Kolkata")
LOCATION_CACHE = OrderedDict()
LOCATION_CACHE_LOCK = threading.Lock()
LOCATION_LAST_REQUEST_AT = 0.0
LOCATION_CACHE_LIMIT = 200

# Create all tables
if settings.AUTO_CREATE_TABLES:
    models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.api_route("/", methods=["GET", "HEAD"], include_in_schema=False)
def service_health():
    return {"status": "ok"}

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def ordered_items(db: Session, model):
    return db.query(model).order_by(model.order_index.asc(), model.id.asc()).all()

def serialize_project(item: models.Project):
    return {
        "id": item.id,
        "order_index": item.order_index or 0,
        "title": item.title or "",
        "period": item.period or "",
        "description": item.description or "",
        "tech": item.tech or "",
        "github": item.github,
        "live": item.live,
        "logo": item.logo,
    }

def serialize_experience(item: models.Experience):
    return {
        "id": item.id,
        "order_index": item.order_index or 0,
        "role": item.role or "",
        "company": item.company or "",
        "period": item.period or "",
        "description": item.description or "[]",
    }

def serialize_skill(item: models.Skill):
    return {
        "id": item.id,
        "order_index": item.order_index or 0,
        "category": item.category or "",
        "items": item.items or "",
    }

def serialize_blog(item: models.Blog):
    return {
        "id": item.id,
        "order_index": item.order_index or 0,
        "title": item.title or "",
        "image": item.image,
        "content_md": item.content_md or "",
        "external_url": item.external_url,
        "published_date": item.published_date or "",
    }

def smtp_notifications_enabled():
    return bool(
        settings.SMTP_HOST
        and settings.SMTP_FROM_EMAIL
        and settings.CONTACT_NOTIFICATION_EMAIL
    )

def masked_email(value):
    email_value = clean_email_header(value)
    if not email_value:
        return ""
    if "@" not in email_value:
        return "***"

    local_part, domain = email_value.rsplit("@", 1)
    if len(local_part) <= 2:
        visible_local = local_part[0] if local_part else "*"
    else:
        visible_local = f"{local_part[0]}***{local_part[-1]}"
    return f"{visible_local}@{domain}"

def smtp_config_status():
    warnings = []
    smtp_host = (settings.SMTP_HOST or "").lower()
    if settings.SMTP_USE_TLS and settings.SMTP_USE_SSL:
        warnings.append("SMTP_USE_TLS and SMTP_USE_SSL should not both be true.")
    if settings.SMTP_USE_SSL and settings.SMTP_PORT != 465:
        warnings.append("SMTP_USE_SSL is usually used with port 465.")
    if settings.SMTP_USE_TLS and settings.SMTP_PORT == 465:
        warnings.append("Port 465 usually needs SMTP_USE_SSL=true and SMTP_USE_TLS=false.")
    if smtp_host == "smtp.gmail.com" and not settings.SMTP_PASSWORD:
        warnings.append("Gmail SMTP requires an app password when 2-step verification is enabled.")
    if smtp_host == "smtp.gmail.com" and settings.SMTP_PASSWORD and " " in settings.SMTP_PASSWORD:
        warnings.append("Gmail app passwords should usually be entered without spaces.")
    if settings.SMTP_USERNAME and settings.SMTP_FROM_EMAIL and settings.SMTP_USERNAME != settings.SMTP_FROM_EMAIL:
        warnings.append("Some providers require SMTP_FROM_EMAIL to match SMTP_USERNAME or a verified sender alias.")

    return {
        "enabled": smtp_notifications_enabled(),
        "host": settings.SMTP_HOST or "",
        "port": settings.SMTP_PORT,
        "username_set": bool(settings.SMTP_USERNAME),
        "username": masked_email(settings.SMTP_USERNAME),
        "password_set": bool(settings.SMTP_PASSWORD),
        "from_email": masked_email(settings.SMTP_FROM_EMAIL),
        "from_name": settings.SMTP_FROM_NAME,
        "notification_email": masked_email(settings.CONTACT_NOTIFICATION_EMAIL),
        "use_tls": settings.SMTP_USE_TLS,
        "use_ssl": settings.SMTP_USE_SSL,
        "timeout_seconds": settings.SMTP_TIMEOUT_SECONDS,
        "warnings": warnings,
    }

def smtp_error_detail(error):
    smtp_error = getattr(error, "smtp_error", None)
    if isinstance(smtp_error, bytes):
        smtp_error = smtp_error.decode("utf-8", errors="replace")

    return {
        "type": type(error).__name__,
        "smtp_code": getattr(error, "smtp_code", None),
        "message": str(smtp_error or error),
    }

@contextmanager
def smtp_client():
    context = ssl.create_default_context()

    if settings.SMTP_USE_SSL:
        with smtplib.SMTP_SSL(
            settings.SMTP_HOST,
            settings.SMTP_PORT,
            timeout=settings.SMTP_TIMEOUT_SECONDS,
            context=context,
        ) as server:
            if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            yield server
        return

    with smtplib.SMTP(
        settings.SMTP_HOST,
        settings.SMTP_PORT,
        timeout=settings.SMTP_TIMEOUT_SECONDS,
    ) as server:
        server.ehlo()
        if settings.SMTP_USE_TLS:
            server.starttls(context=context)
            server.ehlo()
        if settings.SMTP_USERNAME and settings.SMTP_PASSWORD:
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        yield server

def clean_email_header(value):
    return " ".join(str(value or "").splitlines()).strip()

def as_html(value):
    return escape(str(value or "")).replace("\n", "<br>")

def format_ist_datetime(value):
    try:
        received_at = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
        if received_at.tzinfo is None:
            received_at = received_at.replace(tzinfo=timezone.utc)
        return received_at.astimezone(IST_TIMEZONE).strftime("%d %b %Y, %I:%M %p IST")
    except (TypeError, ValueError):
        logger.warning("Could not format contact timestamp as IST: %s", value)
        return "Not available"

def get_visitor_context(payload):
    visitor_context = payload.get("visitor_context") or {}
    location = visitor_context.get("location") or {}
    timezone_name = clean_email_header(visitor_context.get("timezone"))
    locale = clean_email_header(visitor_context.get("locale"))

    try:
        latitude = float(location["latitude"])
        longitude = float(location["longitude"])
    except (KeyError, TypeError, ValueError):
        latitude = longitude = None

    location_label = ""
    location_url = ""
    if latitude is not None and longitude is not None:
        place_parts = []
        for value in (location.get("city"), location.get("region"), location.get("country")):
            cleaned_value = clean_email_header(value)
            if cleaned_value and cleaned_value not in place_parts:
                place_parts.append(cleaned_value)

        location_label = ", ".join(place_parts) or f"{latitude:.5f}, {longitude:.5f}"
        accuracy = location.get("accuracy_meters")
        if accuracy is not None:
            location_label += f" (accuracy: +/- {round(float(accuracy))} m)"
        location_url = f"https://www.google.com/maps?q={latitude:.6f},{longitude:.6f}"

    return timezone_name, locale, location_label, location_url

def reverse_geocode_location(latitude: float, longitude: float):
    global LOCATION_LAST_REQUEST_AT

    cache_key = (round(latitude, 3), round(longitude, 3))
    with LOCATION_CACHE_LOCK:
        cached_location = LOCATION_CACHE.get(cache_key)
        if cached_location:
            LOCATION_CACHE.move_to_end(cache_key)
            return cached_location

        delay = 1 - (time.monotonic() - LOCATION_LAST_REQUEST_AT)
        if delay > 0:
            time.sleep(delay)
        LOCATION_LAST_REQUEST_AT = time.monotonic()

        query = urlencode(
            {
                "format": "jsonv2",
                "lat": f"{latitude:.6f}",
                "lon": f"{longitude:.6f}",
                "zoom": 10,
                "addressdetails": 1,
            }
        )
        request = UrlRequest(
            f"https://nominatim.openstreetmap.org/reverse?{query}",
            headers={
                "Accept": "application/json",
                "User-Agent": settings.LOCATION_LOOKUP_USER_AGENT,
            },
        )

        try:
            with urlopen(request, timeout=settings.LOCATION_LOOKUP_TIMEOUT_SECONDS) as response:
                result = json.load(response)
        except (HTTPError, URLError, TimeoutError, json.JSONDecodeError) as error:
            logger.warning("Location lookup failed: %s", error)
            raise HTTPException(status_code=503, detail="Location lookup is temporarily unavailable")

        address = result.get("address") or {}
        location = {
            "city": address.get("city") or address.get("town") or address.get("village") or address.get("municipality") or address.get("county"),
            "region": address.get("state") or address.get("state_district"),
            "country": address.get("country"),
        }
        LOCATION_CACHE[cache_key] = location
        if len(LOCATION_CACHE) > LOCATION_CACHE_LIMIT:
            LOCATION_CACHE.popitem(last=False)
        return location

def email_detail_row(label, value, link=""):
    displayed_value = as_html(value)
    if link:
        displayed_value = f'<a href="{as_html(link)}" style="color:#007c91;text-decoration:none;">{displayed_value}</a>'
    return f"""\
                  <tr>
                    <td class="contact-label" style="padding:0 20px 16px 0;width:128px;font-size:12px;font-weight:700;letter-spacing:0.9px;color:#52616b;vertical-align:top;">{as_html(label)}</td>
                    <td class="contact-value" style="padding:0 0 16px;font-size:15px;line-height:1.45;color:#17212b;">{displayed_value}</td>
                  </tr>"""

def send_contact_notification(message_id: int, payload: dict, created_at: str):
    if not smtp_notifications_enabled():
        return

    try:
        name = clean_email_header(payload.get("name")) or "Unknown visitor"
        sender_email = clean_email_header(payload.get("email"))
        phone = clean_email_header(payload.get("phone")) or "Not provided"
        message_body = str(payload.get("message") or "").strip()
        received_at = format_ist_datetime(created_at)
        visitor_timezone, visitor_locale, visitor_location, visitor_location_url = get_visitor_context(payload)

        visitor_context_text = []
        visitor_context_html = ""
        if visitor_timezone or visitor_locale or visitor_location:
            if visitor_timezone:
                visitor_context_text.append(f"Visitor timezone: {visitor_timezone}")
            if visitor_locale:
                visitor_context_text.append(f"Browser locale: {visitor_locale}")
            if visitor_location:
                visitor_context_text.append(f"Detected location: {visitor_location}")

            visitor_rows = ""
            if visitor_timezone:
                visitor_rows += email_detail_row("TIMEZONE", visitor_timezone)
            if visitor_locale:
                visitor_rows += email_detail_row("BROWSER LOCALE", visitor_locale)
            if visitor_location:
                visitor_rows += email_detail_row("DETECTED LOCATION", visitor_location, visitor_location_url)

            visitor_context_html = f"""\
                <div style="height:1px;margin:28px 0;background:#dbe3e8;"></div>
                <p style="margin:0 0 16px;font-size:12px;font-weight:700;letter-spacing:1px;color:#52616b;">VISITOR CONTEXT</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
{visitor_rows}
                </table>"""

        email = EmailMessage()
        email["Subject"] = f"Portfolio enquiry from {name}"
        email["From"] = formataddr((settings.SMTP_FROM_NAME, settings.SMTP_FROM_EMAIL))
        email["To"] = clean_email_header(settings.CONTACT_NOTIFICATION_EMAIL)
        email["Date"] = formatdate(localtime=True)
        if sender_email:
            email["Reply-To"] = sender_email

        email.set_content(
            "\n".join(
                [
                    "NEW PORTFOLIO ENQUIRY",
                    "",
                    f"Name: {name}",
                    f"Email: {sender_email or 'Not provided'}",
                    f"Phone: {phone}",
                    f"Received: {received_at}",
                    f"Reference: #{message_id}",
                    *(["", *visitor_context_text] if visitor_context_text else []),
                    "",
                    "Message:",
                    message_body,
                ]
            )
        )
        email.add_alternative(
            f"""\
<!doctype html>
<html lang="en">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      @media screen and (max-width: 600px) {{
        .email-shell {{ padding: 12px !important; }}
        .email-card {{ width: 100% !important; }}
        .email-header, .email-body {{ padding: 24px 20px !important; }}
        .email-heading {{ font-size: 22px !important; }}
        .contact-label, .contact-value {{ display: block !important; width: 100% !important; }}
        .contact-label {{ padding: 0 0 5px !important; }}
        .contact-value {{ padding: 0 0 16px !important; }}
        .message-box {{ padding: 16px !important; }}
      }}
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f3f6f8;color:#17212b;font-family:Arial,sans-serif;">
    <table class="email-shell" role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;padding:24px;background:#f3f6f8;">
      <tr>
        <td align="center">
          <table class="email-card" role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border:1px solid #dbe3e8;">
            <tr>
              <td class="email-header" style="padding:28px 32px;background:#102a43;color:#ffffff;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#80deea;">Portfolio contact form</p>
                <h1 class="email-heading" style="margin:0;font-size:26px;line-height:1.2;font-weight:700;">New enquiry from {as_html(name)}</h1>
              </td>
            </tr>
            <tr>
              <td class="email-body" style="padding:32px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
{email_detail_row("NAME", name)}
{email_detail_row("EMAIL", sender_email or "Not provided", f"mailto:{sender_email}" if sender_email else "")}
{email_detail_row("PHONE", phone)}
{email_detail_row("RECEIVED", f"{received_at} | Reference #{message_id}")}
                </table>
{visitor_context_html}
                <div style="height:1px;margin:28px 0;background:#dbe3e8;"></div>
                <p style="margin:0 0 10px;font-size:13px;font-weight:700;letter-spacing:1px;color:#52616b;">MESSAGE</p>
                <div class="message-box" style="padding:20px;background:#f3f6f8;border-left:3px solid #00a8b5;font-size:16px;line-height:1.65;color:#17212b;">{as_html(message_body)}</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
""",
            subtype="html",
        )

        with smtp_client() as server:
            server.send_message(email)
    except Exception as error:
        logger.exception(
            "SMTP notification failed for contact message %s: %s",
            message_id,
            smtp_error_detail(error),
        )

@app.get("/api/location/reverse")
@limiter.limit("10/minute")
def get_location_name(
    request: Request,
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
):
    if not settings.LOCATION_LOOKUP_ENABLED:
        raise HTTPException(status_code=503, detail="Location lookup is disabled")
    return reverse_geocode_location(latitude, longitude)

def queue_contact_notification(message_id: int, payload: dict, created_at: str):
    if not smtp_notifications_enabled():
        return

    thread = threading.Thread(
        target=send_contact_notification,
        args=(message_id, payload, created_at),
        daemon=True,
    )
    thread.start()

# Auth Dependency
def verify_token(token: str = Depends(lambda: "")): # Simplified for header parsing below
    pass

from fastapi.security import OAuth2PasswordBearer
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

def get_current_admin(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.ALGORITHM])
        if payload.get("sub") != "admin":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate credentials")
    return True

@app.post("/api/login", response_model=schemas.Token)
@limiter.limit("5/minute")
def login(login_data: schemas.LoginRequest, request: Request):
    # Verify password against hash
    is_valid = bcrypt.checkpw(login_data.password.encode('utf-8'), settings.ADMIN_PASSWORD_HASH.encode('utf-8'))
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password")
    
    # Generate JWT
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    token = jwt.encode({"sub": "admin", "exp": expire}, settings.JWT_SECRET_KEY, algorithm=settings.ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}

@app.get("/api/verify-token")
def verify_admin_token(_: bool = Depends(get_current_admin)):
    return {"valid": True}

@app.get("/api/smtp/status")
def get_smtp_status(_: bool = Depends(get_current_admin)):
    return smtp_config_status()

@app.post("/api/smtp/test")
def send_smtp_test(_: bool = Depends(get_current_admin)):
    config_status = smtp_config_status()
    if not smtp_notifications_enabled():
        raise HTTPException(
            status_code=503,
            detail={
                "message": "SMTP notifications are not fully configured.",
                "config": config_status,
            },
        )

    now = datetime.now(IST_TIMEZONE).strftime("%d %b %Y, %I:%M %p IST")
    email = EmailMessage()
    email["Subject"] = "Portfolio SMTP test"
    email["From"] = formataddr((settings.SMTP_FROM_NAME, settings.SMTP_FROM_EMAIL))
    email["To"] = clean_email_header(settings.CONTACT_NOTIFICATION_EMAIL)
    email["Date"] = formatdate(localtime=True)
    email.set_content(
        "\n".join(
            [
                "SMTP test from the portfolio backend.",
                "",
                f"Sent at: {now}",
                f"SMTP host: {settings.SMTP_HOST}:{settings.SMTP_PORT}",
            ]
        )
    )

    try:
        with smtp_client() as server:
            server.send_message(email)
    except Exception as error:
        error_detail = smtp_error_detail(error)
        logger.exception("SMTP test failed: %s", error_detail)
        raise HTTPException(
            status_code=502,
            detail={
                "message": "SMTP test failed.",
                "error": error_detail,
                "config": config_status,
            },
        ) from error

    return {
        "ok": True,
        "message": "SMTP test email sent.",
        "to": config_status["notification_email"],
        "config": config_status,
    }

@app.get("/api/public-content", response_model=schemas.PublicContentResponse)
def get_public_content(db: Session = Depends(get_db)):
    return {
        "projects": [serialize_project(item) for item in ordered_items(db, models.Project)],
        "experiences": [serialize_experience(item) for item in ordered_items(db, models.Experience)],
        "skills": [serialize_skill(item) for item in ordered_items(db, models.Skill)],
        "blogs": [serialize_blog(item) for item in ordered_items(db, models.Blog)],
    }

# --- PROJECTS ---
@app.get("/api/projects", response_model=list[schemas.ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    return [serialize_project(item) for item in ordered_items(db, models.Project)]

@app.post("/api/projects", response_model=schemas.ProjectResponse)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db), _: bool = Depends(get_current_admin)):
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.put("/api/projects/{item_id}", response_model=schemas.ProjectResponse)
def update_project(item_id: int, project: schemas.ProjectCreate, db: Session = Depends(get_db), _: bool = Depends(get_current_admin)):
    db_item = db.query(models.Project).filter(models.Project.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404)
    for key, value in project.model_dump().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/api/projects/{item_id}")
def delete_project(item_id: int, db: Session = Depends(get_db), _: bool = Depends(get_current_admin)):
    db_item = db.query(models.Project).filter(models.Project.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return {"ok": True}

@app.patch("/api/projects/{item_id}/order")
def update_project_order(item_id: int, order_index: int, db: Session = Depends(get_db), _: bool = Depends(get_current_admin)):
    db_item = db.query(models.Project).filter(models.Project.id == item_id).first()
    if db_item:
        db_item.order_index = order_index
        db.commit()
    return {"ok": True}

# --- EXPERIENCES ---
@app.get("/api/experiences", response_model=list[schemas.ExperienceResponse])
def get_experiences(db: Session = Depends(get_db)):
    return [serialize_experience(item) for item in ordered_items(db, models.Experience)]

@app.post("/api/experiences", response_model=schemas.ExperienceResponse)
def create_experience(item: schemas.ExperienceCreate, db: Session = Depends(get_db), _: bool = Depends(get_current_admin)):
    db_item = models.Experience(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.put("/api/experiences/{item_id}", response_model=schemas.ExperienceResponse)
def update_experience(item_id: int, item: schemas.ExperienceCreate, db: Session = Depends(get_db), _: bool = Depends(get_current_admin)):
    db_item = db.query(models.Experience).filter(models.Experience.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404)
    for key, value in item.model_dump().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/api/experiences/{item_id}")
def delete_experience(item_id: int, db: Session = Depends(get_db), _: bool = Depends(get_current_admin)):
    db_item = db.query(models.Experience).filter(models.Experience.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404)
    db.delete(db_item)
    db.commit()
    return {"ok": True}

@app.patch("/api/experiences/{item_id}/order")
def update_experience_order(item_id: int, order_index: int, db: Session = Depends(get_db), _: bool = Depends(get_current_admin)):
    db_item = db.query(models.Experience).filter(models.Experience.id == item_id).first()
    if db_item:
        db_item.order_index = order_index
        db.commit()
    return {"ok": True}

# --- SKILLS ---
@app.get("/api/skills", response_model=list[schemas.SkillResponse])
def get_skills(db: Session = Depends(get_db)):
    return [serialize_skill(item) for item in ordered_items(db, models.Skill)]

@app.post("/api/skills", response_model=schemas.SkillResponse)
def create_skill(item: schemas.SkillCreate, db: Session = Depends(get_db), _: bool = Depends(get_current_admin)):
    db_item = models.Skill(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.put("/api/skills/{item_id}", response_model=schemas.SkillResponse)
def update_skill(item_id: int, item: schemas.SkillCreate, db: Session = Depends(get_db), _: bool = Depends(get_current_admin)):
    db_item = db.query(models.Skill).filter(models.Skill.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404)
    for key, value in item.model_dump().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/api/skills/{item_id}")
def delete_skill(item_id: int, db: Session = Depends(get_db), _: bool = Depends(get_current_admin)):
    db_item = db.query(models.Skill).filter(models.Skill.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404)
    db.delete(db_item)
    db.commit()
    return {"ok": True}

@app.patch("/api/skills/{item_id}/order")
def update_skill_order(item_id: int, order_index: int, db: Session = Depends(get_db), _: bool = Depends(get_current_admin)):
    db_item = db.query(models.Skill).filter(models.Skill.id == item_id).first()
    if db_item:
        db_item.order_index = order_index
        db.commit()
    return {"ok": True}

# --- MESSAGES (CRM) ---
@app.get("/api/messages", response_model=list[schemas.MessageResponse])
def get_messages(db: Session = Depends(get_db), _: bool = Depends(get_current_admin)):
    return db.query(models.Message).order_by(models.Message.id.desc()).all()

@app.post("/api/messages", response_model=schemas.MessageResponse)
@limiter.limit("3/minute")
def create_message(
    item: schemas.MessageCreate,
    request: Request,
    db: Session = Depends(get_db),
):
    created_at = datetime.utcnow().isoformat()
    notification_payload = item.model_dump()
    db_item = models.Message(
        **item.model_dump(exclude={"visitor_context"}),
        created_at=created_at,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    queue_contact_notification(
        db_item.id,
        notification_payload,
        db_item.created_at,
    )
    return db_item

@app.delete("/api/messages/{item_id}")
def delete_message(item_id: int, db: Session = Depends(get_db), _: bool = Depends(get_current_admin)):
    db_item = db.query(models.Message).filter(models.Message.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404)
    db.delete(db_item)
    db.commit()
    return {"ok": True}

# --- ANALYTICS ---
@app.get("/api/analytics", response_model=list[schemas.AnalyticEventResponse])
def get_analytics(db: Session = Depends(get_db), _: bool = Depends(get_current_admin)):
    return db.query(models.AnalyticEvent).order_by(models.AnalyticEvent.id.desc()).all()

@app.post("/api/analytics", response_model=schemas.AnalyticEventResponse)
@limiter.limit("20/minute")
def create_analytics(item: schemas.AnalyticEventCreate, request: Request, db: Session = Depends(get_db)):
    # Resolve real visitor IP (supports reverse proxies / Render / CDNs)
    forwarded = request.headers.get("X-Forwarded-For")
    client_ip = forwarded.split(",")[0].strip() if forwarded else (
        request.client.host if request.client else "unknown"
    )

    # Merge IP into whatever metadata the frontend already sent
    try:
        meta = json.loads(item.metadata_json) if item.metadata_json else {}
    except Exception:
        meta = {}
    meta["ip"] = client_ip

    db_item = models.AnalyticEvent(
        event_type=item.event_type,
        path=item.path,
        metadata_json=json.dumps(meta),
        timestamp=datetime.utcnow().isoformat()
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# --- BLOGS (CMS) ---
@app.get("/api/blogs", response_model=list[schemas.BlogResponse])
def get_blogs(db: Session = Depends(get_db)):
    return [serialize_blog(item) for item in ordered_items(db, models.Blog)]

@app.post("/api/blogs", response_model=schemas.BlogResponse)
def create_blog(item: schemas.BlogCreate, db: Session = Depends(get_db), _: bool = Depends(get_current_admin)):
    db_item = models.Blog(**item.model_dump(), published_date=datetime.utcnow().isoformat())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.put("/api/blogs/{item_id}", response_model=schemas.BlogResponse)
def update_blog(item_id: int, item: schemas.BlogCreate, db: Session = Depends(get_db), _: bool = Depends(get_current_admin)):
    db_item = db.query(models.Blog).filter(models.Blog.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404)
    for key, value in item.model_dump().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/api/blogs/{item_id}")
def delete_blog(item_id: int, db: Session = Depends(get_db), _: bool = Depends(get_current_admin)):
    db_item = db.query(models.Blog).filter(models.Blog.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404)
    db.delete(db_item)
    db.commit()
    return {"ok": True}

@app.patch("/api/blogs/{item_id}/order")
def update_blog_order(item_id: int, order_index: int, db: Session = Depends(get_db), _: bool = Depends(get_current_admin)):
    db_item = db.query(models.Blog).filter(models.Blog.id == item_id).first()
    if db_item:
        db_item.order_index = order_index
        db.commit()
    return {"ok": True}
