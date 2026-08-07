from dotenv import load_dotenv
import os

load_dotenv()

def env_bool(name, default=False):
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}

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
    ALLOWED_ORIGINS = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")]

    # SMTP notifications for contact-form leads.
    SMTP_HOST = os.getenv("SMTP_HOST")
    SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
    _SMTP_USERNAME = os.getenv("SMTP_USERNAME")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
    SMTP_FROM_EMAIL = os.getenv("SMTP_FROM_EMAIL") or _SMTP_USERNAME or ""
    SMTP_USERNAME = _SMTP_USERNAME or SMTP_FROM_EMAIL
    SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "Portfolio Contact")
    CONTACT_NOTIFICATION_EMAIL = os.getenv("CONTACT_NOTIFICATION_EMAIL", SMTP_FROM_EMAIL)
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

    def __post_init__(self):
        if not self.JWT_SECRET_KEY:
            raise RuntimeError("JWT_SECRET_KEY is not set in .env — refusing to start.")
        if not self.ADMIN_PASSWORD_HASH:
            raise RuntimeError("ADMIN_PASSWORD_HASH is not set in .env — refusing to start.")

settings = Settings()
