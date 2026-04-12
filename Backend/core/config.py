from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    ENV = os.getenv("ENV", "development")

    # Database
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./portfolio.db")

    # JWT — no fallback; must be set in .env
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 480))  # 8 hours

    # Bcrypt hash of admin password — no fallback; must be set in .env
    ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH")

    # CORS — comma-separated list of allowed origins
    ALLOWED_ORIGINS = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")]

    def __post_init__(self):
        if not self.JWT_SECRET_KEY:
            raise RuntimeError("JWT_SECRET_KEY is not set in .env — refusing to start.")
        if not self.ADMIN_PASSWORD_HASH:
            raise RuntimeError("ADMIN_PASSWORD_HASH is not set in .env — refusing to start.")

settings = Settings()
