from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "postgres://root:root@localhost:5432/todo_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)
Base = declarative_base()

def get_db():
    db=SessionLocal
    try:
        yield db

    finally:
        db.close()
