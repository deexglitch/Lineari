#builds gravatar URL from employee email
#this should hash the the email 
import hashlib


def gravatar_url(email: str, size: int = 200) -> str:
    """Build a Gravatar URL from an email. Falls back to a generated identicon."""
    digest = hashlib.sha256(email.strip().lower().encode("utf-8")).hexdigest()
    return f"https://www.gravatar.com/avatar/{digest}?s={size}&d=identicon"