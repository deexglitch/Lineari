from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from .config import settings

engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False)

class Base(DeclarativeBase):
    pass


def get_db():
    """" Give each request its own db session and always close it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()