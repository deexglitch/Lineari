from typing import Annotated

from fastapi import Depends

from .deps import get_current_user
from .models import User
from ..errors import AppError

def require_admin(user: Annotated[User, Depends(get_current_user)]) -> User:
    """Dependency that raises 403 if the user is not an admin."""
    if user.role != "admin":
        raise AppError(403, "forbidden", "You do not have permission to perform this action.")
    return user