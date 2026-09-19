import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./missionpay.db")

def create_db_engine(url):
    connect_args = {"check_same_thread": False} if url.startswith("sqlite") else {}
    return create_engine(url, pool_pre_ping=True, connect_args=connect_args)

try:
    engine = create_db_engine(DATABASE_URL)
    with engine.connect() as conn:
        pass
except Exception as e:
    print(f"[Database Warning] Failed to connect to {DATABASE_URL}: {e}")
    print("[Database Warning] Falling back to local SQLite database: sqlite:///./missionpay.db")
    DATABASE_URL = "sqlite:///./missionpay.db"
    engine = create_db_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()