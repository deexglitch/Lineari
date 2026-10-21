from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Cookie, Depends, Response
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator
from sqlalchemy import select, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..auth.deps import get_current_user
from ..auth.models import RefreshToken, User
from ..auth.security import (
    DUMMY_HASH,
    clear_auth_cookies,
    create_access_token,
    hash_password,
    hash_refresh_token,
    new_refresh_token,
    set_auth_cookies,
    validate_password_strength,
    verify_password,
)
from ..auth.settings import get_auth_settings
from ..db import get_db
from ..errors import AppError

settings = get_auth_settings()
router = APIRouter(prefix="/auth", tags=["Auth"])

Name = Annotated[str, Field(min_length=1, max_length=100)]


class SignupRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    email: EmailStr
    password: str
    first_name: Name
    last_name: Name

    @field_validator("password")
    @classmethod
    def strong_password(cls, value: str) -> str:
        return validate_password_strength(value)


class LoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    email: EmailStr
    # No strength rules here. They only matter when a password is chosen.
    password: str = Field(min_length=1, max_length=128)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    email: EmailStr
    first_name: str
    last_name: str
    role: str 
    created_at: datetime


class MessageOut(BaseModel):
    message: str


def _start_session(db: Session, user: User, response: Response) -> None:
    refresh, refresh_hash = new_refresh_token()
    expires = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
    db.add(RefreshToken(user_id=user.id, token_hash=refresh_hash, expires_at=expires))
    db.commit()
    set_auth_cookies(
        response,
        access_token=create_access_token(user.id),
        refresh_token=refresh,
        refresh_expires_at=expires,
    )


@router.post("/signup", response_model=UserOut, status_code=201)
def signup(payload: SignupRequest, response: Response, db: Annotated[Session, Depends(get_db)]):
    email = payload.email.lower()
    if db.scalar(select(User.id).where(User.email == email)):
        raise AppError(409, "duplicate_email", "An account with this email already exists")

    user = User(
        email=email,
        hashed_password=hash_password(payload.password),
        first_name=payload.first_name,
        last_name=payload.last_name,
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:  # two signups raced for the same email
        db.rollback()
        raise AppError(409, "duplicate_email", "An account with this email already exists")
    db.refresh(user)

    _start_session(db, user, response)
    return user


@router.post("/login", response_model=UserOut)
def login(payload: LoginRequest, response: Response, db: Annotated[Session, Depends(get_db)]):
    user = db.scalar(select(User).where(User.email == payload.email.lower()))
    # Always run one bcrypt check, so response time does not reveal which emails exist.
    password_ok = verify_password(payload.password, user.hashed_password if user else DUMMY_HASH)
    if user is None or not password_ok or not user.is_active:
        raise AppError(401, "invalid_credentials", "Invalid email or password")

    _start_session(db, user, response)
    return user


@router.post("/refresh", response_model=MessageOut)
def refresh(
    response: Response,
    db: Annotated[Session, Depends(get_db)],
    refresh_token: Annotated[str | None, Cookie(alias=settings.refresh_cookie_name)] = None,
):
    if not refresh_token:
        raise AppError(401, "unauthorized", "No refresh token provided")

    stored = db.scalar(
        select(RefreshToken).where(RefreshToken.token_hash == hash_refresh_token(refresh_token))
    )
    if stored is None:
        raise AppError(401, "unauthorized", "Refresh token is invalid")

    if stored.revoked:
        # A used token came back, so it may have been stolen. End every session for this user.
        db.execute(
            update(RefreshToken).where(RefreshToken.user_id == stored.user_id).values(revoked=True)
        )
        db.commit()
        raise AppError(401, "unauthorized", "Refresh token has already been used")

    if stored.expires_at < datetime.now(timezone.utc):
        raise AppError(401, "unauthorized", "Refresh token has expired")

    user = db.get(User, stored.user_id)
    if user is None or not user.is_active:
        raise AppError(401, "unauthorized", "User no longer exists")

    stored.revoked = True  # rotation: every refresh token works exactly once
    _start_session(db, user, response)
    return MessageOut(message="Session refreshed")


@router.post("/logout", response_model=MessageOut)
def logout(
    response: Response,
    db: Annotated[Session, Depends(get_db)],
    refresh_token: Annotated[str | None, Cookie(alias=settings.refresh_cookie_name)] = None,
):
    if refresh_token:
        db.execute(
            update(RefreshToken)
            .where(RefreshToken.token_hash == hash_refresh_token(refresh_token))
            .values(revoked=True)
        )
        db.commit()
    clear_auth_cookies(response)
    return MessageOut(message="Signed out")


@router.get("/me", response_model=UserOut)
def me(user: Annotated[User, Depends(get_current_user)]):
    return user

class ProfileUpdateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    email: EmailStr | None = None
    first_name: Name | None = None
    last_name: Name | None = None


class PasswordChangeRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    current_password: str = Field(min_length=1, max_length=128)
    new_password: str

    @field_validator("new_password")
    @classmethod
    def strong_password(cls, value: str) -> str:
        return validate_password_strength(value)


@router.patch("/me", response_model=UserOut)
def update_me(
    payload: ProfileUpdateRequest,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
):
    changes = payload.model_dump(exclude_unset=True)

    if "email" in changes:
        email = changes["email"].lower()
        if email != user.email:
            taken = db.scalar(
                select(User.id).where(User.email == email, User.id != user.id)
            )
            if taken:
                raise AppError(409, "duplicate_email", "That email is already in use")
            user.email = email

    if "first_name" in changes:
        user.first_name = changes["first_name"]
    if "last_name" in changes:
        user.last_name = changes["last_name"]

    db.commit()
    db.refresh(user)
    return user


@router.post("/me/password", response_model=MessageOut)
def change_password(
    payload: PasswordChangeRequest,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
):
    if not verify_password(payload.current_password, user.hashed_password):
        raise AppError(401, "invalid_credentials", "Current password is incorrect")

    user.hashed_password = hash_password(payload.new_password)

    # Revoke every refresh token so any other signed-in session ends.
    db.execute(
        update(RefreshToken).where(RefreshToken.user_id == user.id).values(revoked=True)
    )
    db.commit()
    return MessageOut(message="Password updated")