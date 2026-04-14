from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import bcrypt
import jwt
import json
from datetime import datetime, timedelta

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request

from core.database import engine, SessionLocal, Base
from core.config import settings
from core import models, schemas

# Create all tables
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

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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

# --- PROJECTS ---
@app.get("/api/projects", response_model=list[schemas.ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).order_by(models.Project.order_index.asc()).all()

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
    return db.query(models.Experience).order_by(models.Experience.order_index.asc()).all()

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
    return db.query(models.Skill).order_by(models.Skill.order_index.asc()).all()

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
def create_message(item: schemas.MessageCreate, request: Request, db: Session = Depends(get_db)):
    db_item = models.Message(**item.model_dump(), created_at=datetime.utcnow().isoformat())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
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
    return db.query(models.Blog).order_by(models.Blog.order_index.asc()).all()

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