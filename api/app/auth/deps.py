
from typing import Annotated

from fastapi import Cookie, Depends
from sqlalchemy.orm import Session

from ..db import get_db
from ..errors import AppError
from .models import User
from .security import TokenError, decode_access_token
from .settings import get_auth_settings

settings = get_auth_settings()


def get_current_user(
    db: Annotated[Session, Depends(get_db)],
    access_token: Annotated[str | None, Cookie(alias=settings.access_cookie_name)] = None,
) -> User:
    """Reads the JWT from the http-only cookie. Use it to protect any route."""
    if not access_token:
        raise AppError(401, "unauthorized", "You are not signed in")
    try:
        user_id = decode_access_token(access_token)
    except TokenError:
        raise AppError(401, "unauthorized", "Your session has expired")
    user = db.get(User, user_id)
    if user is None or not user.is_active:
        raise AppError(401, "unauthorized", "Your session is no longer valid")
    return user