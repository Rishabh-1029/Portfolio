from dotenv import load_dotenv
import os
import re

load_dotenv()

def env_bool(name, default=False):
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}

def env_text(name, default=None):
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip()

class Settings:
    ENV = os.getenv("ENV", "development")

    # Database
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./portfolio.db")
    AUTO_CREATE_TABLES = env_bool("AUTO_CREATE_TABLES", ENV != "production")

    # JWT — no fallback; must be set in .env
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 480))  # 8 hours

    # Bcrypt hash of admin password — no fallback; must be set in .env
    ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH")

    # CORS — comma-separated list of allowed origins
    ALLOWED_ORIGINS = [
        origin.strip()
        for origin in os.getenv(
            "ALLOWED_ORIGINS", "http://localhost:5173"
        ).split(",")
        if origin.strip()
    ]

    # SMTP notifications for contact-form leads.
    SMTP_HOST = env_text("SMTP_HOST")
    SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
    _SMTP_USERNAME = env_text("SMTP_USERNAME")
    SMTP_PASSWORD = env_text("SMTP_PASSWORD")
    SMTP_FROM_EMAIL = env_text("SMTP_FROM_EMAIL") or _SMTP_USERNAME or ""
    SMTP_USERNAME = _SMTP_USERNAME or SMTP_FROM_EMAIL
    SMTP_FROM_NAME = env_text("SMTP_FROM_NAME", "Portfolio Contact")
    CONTACT_NOTIFICATION_EMAIL = env_text("CONTACT_NOTIFICATION_EMAIL", SMTP_FROM_EMAIL)
    SMTP_USE_TLS = env_bool("SMTP_USE_TLS", True)
    SMTP_USE_SSL = env_bool("SMTP_USE_SSL", False)
    SMTP_TIMEOUT_SECONDS = int(os.getenv("SMTP_TIMEOUT_SECONDS", 5))

    # Reverse geocoding for the contact form's optional location context.
    LOCATION_LOOKUP_ENABLED = env_bool("LOCATION_LOOKUP_ENABLED", True)
    LOCATION_LOOKUP_TIMEOUT_SECONDS = int(os.getenv("LOCATION_LOOKUP_TIMEOUT_SECONDS", 4))
    LOCATION_LOOKUP_USER_AGENT = os.getenv(
        "LOCATION_LOOKUP_USER_AGENT",
        "RishabhPortfolio/1.0 (+https://rishabh-surana.netlify.app/)",
    )

    def __init__(self):
        if not self.JWT_SECRET_KEY:
            raise RuntimeError("JWT_SECRET_KEY is not set in .env — refusing to start.")
        if len(self.JWT_SECRET_KEY.encode("utf-8")) < 32:
            raise RuntimeError("JWT_SECRET_KEY must contain at least 32 bytes of secret material.")
        if not self.ADMIN_PASSWORD_HASH:
            raise RuntimeError("ADMIN_PASSWORD_HASH is not set in .env — refusing to start.")
        if "*" in self.ALLOWED_ORIGINS:
            raise RuntimeError("ALLOWED_ORIGINS cannot contain '*' when credentialed CORS is enabled.")

        hash_match = re.fullmatch(
            r"\$(2[aby])\$(\d{2})\$[./A-Za-z0-9]{53}",
            self.ADMIN_PASSWORD_HASH,
        )
        if not hash_match or not 10 <= int(hash_match.group(2)) <= 14:
            raise RuntimeError(
                "ADMIN_PASSWORD_HASH must be a valid bcrypt hash with a cost between 10 and 14."
            )

        if self.ACCESS_TOKEN_EXPIRE_MINUTES < 1 or self.ACCESS_TOKEN_EXPIRE_MINUTES > 1440:
            raise RuntimeError("ACCESS_TOKEN_EXPIRE_MINUTES must be between 1 and 1440.")

settings = Settings()
