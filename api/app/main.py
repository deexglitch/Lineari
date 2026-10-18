from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from .config import settings
from .db import engine
from .errors import register_error_handlers
from .routers import employees, hierarchy

app = FastAPI(title="Lineari API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)
register_error_handlers(app)
app.include_router(employees.router)
app.include_router(hierarchy.router)


@app.get("/health")
def health():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"status": "ok"}