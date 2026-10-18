# The organization as a nested tree, for the hierarchy view.
# endpoint for tree related functionality

import uuid
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..db import get_db
from ..errors import AppError
from ..gravatar import gravatar_url
from ..models import Employee
from ..schemas import HierarchyNode

router = APIRouter(tags=["Hierarchy"])


@router.get("/hierarchy", response_model=list[HierarchyNode])
def get_hierarchy(
    db: Annotated[Session, Depends(get_db)],
    root_id: uuid.UUID | None = None,
    max_depth: Annotated[int | None, Query(ge=0)] = None,
):
    """Everyone with no manager is a root, with their reports nested underneath."""
    employees = db.scalars(select(Employee)).all()

    # Group everyone under their manager once, instead of querying per person.
    children_of: dict[uuid.UUID | None, list[Employee]] = {}
    for emp in employees:
        children_of.setdefault(emp.manager_id, []).append(emp)
    for group in children_of.values():
        group.sort(key=lambda e: (e.surname.lower(), e.name.lower()))

    def build(emp: Employee, depth: int) -> HierarchyNode:
        reports = children_of.get(emp.id, [])
        show_children = max_depth is None or depth < max_depth
        return HierarchyNode(
            id=emp.id,
            name=emp.name,
            surname=emp.surname,
            role=emp.role,
            avatar_url=gravatar_url(emp.email),
            direct_report_count=len(reports),
            children=[build(r, depth + 1) for r in reports] if show_children else [],
        )

    if root_id is not None:
        root = next((e for e in employees if e.id == root_id), None)
        if root is None:
            raise AppError(404, "not_found", "Employee not found")
        roots = [root]
    else:
        roots = children_of.get(None, [])

    return [build(r, 0) for r in roots]