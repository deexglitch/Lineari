import uuid
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import (
    CheckConstraint,
    Date,
    DateTime,
    ForeignKey,
    Numeric,
    String,
    Uuid,
    func,
    text
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .db import Base

# this is our employee main class table
class Employee(Base):
    __tablename__ = "employees"
    __table_args__ = (
        CheckConstraint(
            "manager_id IS NULL OR manager_id <> id",
            name="ck_employees_not_own_manager"
        ),
        CheckConstraint("salary >= 0", name="ck_employees_salary_non_negative")
    )

    #maps each employee to a unique uuid number, name, surname, email - needs to be unique, dob, employeeNo, salary and role
    #manager id no (FK), created at, updaated at, manager, direct reports
    id: Mapped[uuid.UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()")
    )
    name: Mapped[str] = mapped_column(String(100))
    surname: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True)
    birth_date: Mapped[date] = mapped_column(Date)
    emp_number: Mapped[str] = mapped_column(String(32), unique=True)
    salary: Mapped[Decimal] = mapped_column(Numeric(12,2))
    role: Mapped[str] = mapped_column(String(100))

    #null => no manager for people like the ceo big boss, RESTRICT stops db from deleting a manager with direct reports
    manager_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("employees.id", ondelete="RESTRICT"),
        index=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    updated_at: Mapped[datetime] = mapped_column(
            DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
        )

    # manager can either be another employee or no one
    manager: Mapped["Employee | None"] = relationship(
        remote_side="Employee.id", back_populates="direct_reports"
    )

    direct_reports: Mapped[list["Employee"]] = relationship(
        back_populates="manager"
    )
    
