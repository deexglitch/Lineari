from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from .auth.deps import get_current_user
from .config import settings
from .db import engine
from .errors import register_error_handlers
from .routers import auth, employees, hierarchy

app = FastAPI(title="Lineari API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins.split(","),
    allow_credentials=True,  # needed so the browser sends and accepts the auth cookies
    allow_methods=["*"],
    allow_headers=["*"],
)
register_error_handlers(app)
app.include_router(auth.router)
app.include_router(employees.router, dependencies=[Depends(get_current_user)])
app.include_router(hierarchy.router, dependencies=[Depends(get_current_user)])


@app.get("/health")
def health():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"status": "ok"}