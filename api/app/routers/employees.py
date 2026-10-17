#contains endpoints 

import uuid
from datetime import date
from decimal import Decimal
from typing import Annotated, Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, aliased

from ..db import get_db
from ..errors import AppError
from ..gravatar import gravatar_url
from ..models import Employee
from ..schemas import EmployeeCreate, EmployeeList, EmployeeOut

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