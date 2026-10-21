from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class AuthSettings(BaseSettings):
    model_config = SettingsConfigDict(env_file="../.env", extra="ignore")

    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    jwt_issuer: str = "lineari"
    jwt_audience: str = "lineari_web"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    # Over plain http on localhost keep cookie_secure false. In production set COOKIE_SECURE=true.
    cookie_secure: bool = False
    cookie_samesite: Literal["lax", "strict", "none"] = "lax"
    cookie_domain: str | None = None
    access_cookie_name: str = "lineari_access"
    refresh_cookie_name: str = "lineari_refresh"
    bcrypt_rounds: int = 12
    refresh_cookie_path: str = "/auth"


@lru_cache
def get_auth_settings() -> AuthSettings:
    return AuthSettings()