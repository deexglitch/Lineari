# holds the requests and responses shape from contract with validation rules

from datetime import date, datetime
from decimal import Decimal
from typing import Annotated
from uuid import UUID

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_serializer,
    field_validator,
    model_validator
)

ShortText = Annotated[str, Field(min_length=1, max_length=100)]
EmployeeNumber = Annotated[str, Field(min_length=1, max_length=32)]
Salary = Annotated[Decimal, Field(ge=0, max_digits=12, decimal_places=2)]


#function to check date is valid
def _check_birth_date(value: date | None) -> date | None:
    if value is not None and value >= date.today():
        raise ValueError("birth date cannot be today, please enter a valid past date")
    return value

# CREATE an employee
class EmployeeCreate(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    name: ShortText
    surname: ShortText
    email: EmailStr
    birth_date: date
    emp_number: EmployeeNumber
    salary: Salary
    role: ShortText
    manager_id: UUID | None = None

    _birth_date_in_past = field_validator("birth_date")(_check_birth_date)


# UPDATE an existing employee
class EmployeeUpdate(BaseModel):
    """" Any subset of fields. manager_id may be null to remove the manager."""
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    name: ShortText | None = None
    surname: ShortText | None = None
    email: EmailStr | None = None
    birth_date: date | None = None
    emp_number: EmployeeNumber | None = None
    salary: Salary | None = None
    role: ShortText | None = None
    manager_id: UUID | None = None

    _birth_date_in_past = field_validator("birth_date")(_check_birth_date)

    #checks to make sure the fields are still valid after update
    @model_validator(mode="after")
    def check_fields(self):
        if not self.model_fields_set:
            raise ValueError("Please change at least one field to update")
        for field in self.model_fields_set - {"manager_id"}:
            if getattr(self, field) is None:
                raise ValueError(f"{field} cannot be null. Please enter a value")
        return self


#actual employee details
class EmployeeOut(BaseModel):
    id: UUID
    name: str
    surname: str
    email: str
    birth_date: date
    emp_number: str
    salary: Decimal
    role: str
    manager_id: UUID | None
    manager_name: str | None
    avatar_url: str
    direct_report_count: int
    created_at: datetime
    updated_at: datetime

    #helper to cast the decimal to a float value
    @field_serializer("salary")
    def serialize_salary(self, value: Decimal) -> float:
        return float(value)


class EmployeeList(BaseModel):
    items: list[EmployeeOut]
    total: int
    page: int
    page_size: int