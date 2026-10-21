# Builds a Gravatar URL from an employee's email.
# Gravatar hashes the trimmed, lowercased email with MD5.
import hashlib


def gravatar_url(email: str, size: int = 200) -> str:
    """Gravatar URL with d=404 so the frontend falls back to initials when
    the email has no Gravatar account."""
    digest = hashlib.md5(
        email.strip().lower().encode("utf-8"), usedforsecurity=False
    ).hexdigest()
    return f"https://www.gravatar.com/avatar/{digest}?s={size}&d=404"