"""Promote an existing user to admin.

Usage (from api/):
    uv run python -m scripts.promote you@example.com
"""
import sys

from sqlalchemy import select

from app.auth.models import User
from app.db import SessionLocal


def main(email: str) -> None:
    with SessionLocal() as db:
        user = db.scalar(select(User).where(User.email == email.lower()))
        if user is None:
            raise SystemExit(f"No user with email {email}")
        user.role = "admin"
        db.commit()
        print(f"{email} is now an admin.")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python -m scripts.promote <email>")
    main(sys.argv[1])