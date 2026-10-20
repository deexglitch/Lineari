#contains endpoints 

import uuid
from datetime import date
from decimal import Decimal
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Query, Response
from sqlalchemy import func, or_, select, update
from sqlalchemy.orm import Session, aliased

from ..db import get_db
from ..errors import AppError
from ..gravatar import gravatar_url
from ..models import Employee
from ..schemas import EmployeeCreate, EmployeeList, EmployeeOut, EmployeeUpdate

router = APIRouter(prefix="/employees", tags=["Employees"])

Manager = aliased(Employee)
Report = aliased(Employee)

SORT_COLUMNS = {
    "name": [Employee.name],
    "surname": [Employee.surname],
    "email": [Employee.email],
    "birth_date": [Employee.birth_date],
    "emp_number": [Employee.emp_number],
    "salary": [Employee.salary],
    "role": [Employee.role],
    "manager": [Manager.surname, Manager.name]
}

def _base_select():
    """Employee rows and manager name and a count of direct reports"""
    report_count = (
        select(func.count(Report.id))
        .where(Report.manager_id == Employee.id)
        .correlate(Employee)
        .scalar_subquery()
    )
    return select(
        Employee,
        Manager.name,
        Manager.surname,
        report_count.label("direct_report_count"),
    ).outerjoin(Manager, Employee.manager_id == Manager.id)

# helper to get employee table infomation 
def _to_out(row) -> EmployeeOut:
    emp, Manager_name, manager_surname, report_count = row
    return EmployeeOut(
        id=emp.id,
        name=emp.name,
        surname=emp.surname,
        email=emp.email,
        birth_date=emp.birth_date,
        emp_number=emp.emp_number,
        salary=emp.salary,
        role=emp.role,
        manager_id=emp.manager_id,
        manager_name=f"{Manager_name} {manager_surname}" if Manager_name else None,
        avatar_url=gravatar_url(emp.email),
        direct_report_count=report_count,
        created_at=emp.created_at,
        updated_at=emp.updated_at
    )

# helper to execute queries
def _get_out(db: Session, employee_id: uuid.UUID) -> EmployeeOut:
    row = db.execute(_base_select().where(Employee.id == employee_id)).one_or_none()
    if row is None:
        raise AppError(404, "not_found", "Employee is not found, Please try again")
    return _to_out(row)

# deals with any circular dependencies here
def _chain_contains(db: Session, start_id: uuid.UUID, needle_id: uuid.UUID) -> bool:
    """True if needle_id is start_id, or anyone above has a start_id in the reporting chain.
    
    goes to the manager links via a recursive query. We use it to stop any circular reporting lines
    for example: if a new manager already reports to the employee, then making them a manager creates an endless loop of reporting to eachother.
    """

    chain = (
        select(Employee.id.label("id"), Employee.manager_id.label("manager_id"))
        .where(Employee.id == start_id)
        .cte("chain", recursive=True)
    )
    above = aliased(Employee)
    chain = chain.union(select(above.id, above.manager_id).where(above.id == chain.c.manager_id))
    found = db.scalar(select(func.count()).select_from(chain).where(chain.c.id == needle_id))
    return bool(found)


# GET request for employee list
@router.get("", response_model=EmployeeList)
def list_employees(
    db: Annotated[Session, Depends(get_db)],
    search: str | None = None,
    role: str | None = None,
    manager_id: uuid.UUID | None = None,
    has_manager: bool | None = None,
    salary_min: Decimal | None = None,
    salary_max: Decimal | None = None,
    birth_date_from: date | None = None,
    birth_date_to: date | None = None,
    sort_by: Literal[
        "name", "surname", "email", "birth_date", "emp_number", "salary", "role", "manager"
    ] = "surname",
    order: Literal["asc", "desc"] = "asc",
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 25
):
    filters = []
    if search and search.strip():
        like = f"%{search.strip()}%"
        filters.append(
            or_(
                Employee.name.ilike(like),
                Employee.surname.ilike(like),
                Employee.email.ilike(like),
                Employee.emp_number.ilike(like),
                Employee.role.ilike(like)
            )
        )
    if role:
        filters.append(Employee.role.ilike(f"%{role.strip()}%"))
    if manager_id is not None:
        filters.append(Employee.manager_id == manager_id)
    if has_manager is True:
        filters.append(Employee.manager_id.is_not(None))
    if has_manager is False:
        filters.append(Employee.manager_id.is_(None))
    if salary_min is not None:
        filters.append(Employee.salary >= salary_min)
    if salary_max is not None:
        filters.append(Employee.salary <= salary_max)
    if birth_date_from is not None:
        filters.append(Employee.birth_date >= birth_date_from)
    if birth_date_to is not None:
        filters.append(Employee.birth_date <= birth_date_to)

    total = db.scalar(select(func.count(Employee.id)).where(*filters)) or 0

    ordering = [c.desc() if order == "desc" else c.asc() for c in SORT_COLUMNS[sort_by]]
    ordering.append(Employee.id) #this keeps paging when values do tie 

    rows = db.execute(
        _base_select()
        .where(*filters)
        .order_by(*ordering)
        .limit(page_size)
        .offset((page - 1) * page_size)
    ).all()

    return EmployeeList(
        items=[_to_out(r) for r in rows], total=total, page=page, page_size=page_size
    )

# POST response endpoint
@router.post("", response_model=EmployeeOut, status_code=201)
def  create_employee(payload: EmployeeCreate, db: Annotated[Session, Depends(get_db)]):
    if payload.manager_id is not None and db.get(Employee, payload.manager_id) is None:
        raise AppError(404, "not_found", "Manager not found, please try again")

    email = payload.email.strip().lower()
    if db.scalar(select(Employee.id).where(Employee.emp_number == payload.emp_number)):
        raise AppError(409, "duplicate_employee_number", "This employee number is already in use")
    if db.scalar(select(Employee.id).where(func.lower(Employee.email) == email)):
        raise AppError(409, "duplicate_email", "This email is already in use")

    employee = Employee(**{**payload.model_dump(), "email": email})
    db.add(employee)
    db.commit()
    return _get_out(db, employee.id)

#GET request endpoint for returning an employee
@router.get("/{employee_id}", response_model=EmployeeOut)
def get_employee(employee_id: uuid.UUID, db: Annotated[Session, Depends(get_db)]):
    return _get_out(db, employee_id)
 
 
@router.patch("/{employee_id}", response_model=EmployeeOut)
def update_employee(
    employee_id: uuid.UUID,
    payload: EmployeeUpdate,
    db: Annotated[Session, Depends(get_db)],
):
    employee = db.get(Employee, employee_id)
    if employee is None:
        raise AppError(404, "not_found", "Employee not found")
 
    # Only the fields the client actually sent. This is how we tell
    # "manager_id: null" (remove the manager) apart from "manager_id not sent".
    changes = payload.model_dump(exclude_unset=True)
 
    if changes.get("manager_id") is not None:
        new_manager_id = changes["manager_id"]
        if new_manager_id == employee.id:
            raise AppError(422, "self_manager", "An employee cannot be their own manager")
        if db.get(Employee, new_manager_id) is None:
            raise AppError(404, "not_found", "Manager not found")
        if _chain_contains(db, new_manager_id, employee.id):
            raise AppError(
                422,
                "circular_reporting_line",
                "That would create a circular reporting line",
            )
 
    if "emp_number" in changes:
        taken = db.scalar(
            select(Employee.id).where(
                Employee.emp_number == changes["emp_number"], Employee.id != employee.id
            )
        )
        if taken:
            raise AppError(409, "duplicate_employee_number", "This employee number is already in use")
 
    if "email" in changes:
        changes["email"] = changes["email"].strip().lower()
        taken = db.scalar(
            select(Employee.id).where(
                func.lower(Employee.email) == changes["email"], Employee.id != employee.id
            )
        )
        if taken:
            raise AppError(409, "duplicate_email", "This email is already in use")
 
    for field, value in changes.items():
        setattr(employee, field, value)
    db.commit()
    return _get_out(db, employee.id)
 
 
@router.delete("/{employee_id}", status_code=204)
def delete_employee(
    employee_id: uuid.UUID,
    db: Annotated[Session, Depends(get_db)],
    reassign_reports_to: uuid.UUID | None = None,
    reassign_to_none: bool = False,
):
    employee = db.get(Employee, employee_id)
    if employee is None:
        raise AppError(404, "not_found", "Employee not found")
 
    if reassign_reports_to is not None and reassign_to_none:
        raise AppError(
            422,
            "validation_error",
            "Use either reassign_reports_to or reassign_to_none, not both",
        )
 
    report_count = db.scalar(
        select(func.count(Employee.id)).where(Employee.manager_id == employee.id)
    )
 
    if report_count and reassign_reports_to is None and not reassign_to_none:
        raise AppError(
            409,
            "has_direct_reports",
            "This employee has direct reports. Reassign them before deleting.",
            {"direct_report_count": report_count},
        )
 
    if report_count:
        if reassign_reports_to is not None:
            if reassign_reports_to == employee.id:
                raise AppError(422, "validation_error", "Cannot reassign reports to the employee being deleted")
            if db.get(Employee, reassign_reports_to) is None:
                raise AppError(404, "not_found", "The new manager was not found")
            # The new manager must not sit underneath the employee being deleted,
            # otherwise moving the reports to them would create a loop.
            if _chain_contains(db, reassign_reports_to, employee.id):
                raise AppError(
                    422,
                    "circular_reporting_line",
                    "The new manager reports to the employee being deleted",
                )
        # Move the reports and delete in one transaction, so nothing is half done.
        db.execute(
            update(Employee)
            .where(Employee.manager_id == employee.id)
            .values(manager_id=reassign_reports_to)
        )
        db.expire_all()
        employee = db.get(Employee, employee_id)
 
    db.delete(employee)
    db.commit()
    return Response(status_code=204)
 
 
@router.get("/{employee_id}/ancestors", response_model=list[EmployeeOut], tags=["Hierarchy"])
def get_employee_ancestors(employee_id: uuid.UUID, db: Annotated[Session, Depends(get_db)]):
    """Managers above this employee, from the top of the organisation down."""
    employee = db.get(Employee, employee_id)
    if employee is None:
        raise AppError(404, "not_found", "Employee not found")
 
    chain: list[EmployeeOut] = []
    seen: set[uuid.UUID] = set()
    current_id = employee.manager_id
    while current_id is not None and current_id not in seen:
        seen.add(current_id)
        row = db.execute(_base_select().where(Employee.id == current_id)).one()
        chain.append(_to_out(row))
        current_id = row[0].manager_id
    chain.reverse()
    return chain
 