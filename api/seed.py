"""
Seed the Lineari database with a small reporting tree.

Run from api/:
    uv run python seed.py

Safe to re-run: employees are only inserted if their email is not already present.
"""

from datetime import date
from decimal import Decimal

from sqlalchemy import select

from app.db import SessionLocal
from app.models import Employee

# (name, surname, role, email, emp_no, dob, salary, manager_email_or_None)
PEOPLE = [
    ("Aisha",  "Patel",    "CEO",                "aisha.patel@lineari.dev",    "EMP-001", date(1978,  3, 12), "185000.00", None),
    ("Rajesh", "Chetty",   "CTO",                "rajesh.chetty@lineari.dev",  "EMP-002", date(1982,  7,  4), "150000.00", "aisha.patel@lineari.dev"),
    ("Lerato", "Dlamini",  "CFO",                "lerato.dlamini@lineari.dev", "EMP-003", date(1984, 11, 19), "145000.00", "aisha.patel@lineari.dev"),
    ("Sipho",  "Mthembu",  "COO",                "sipho.mthembu@lineari.dev",  "EMP-004", date(1980,  5, 28), "148000.00", "aisha.patel@lineari.dev"),
    ("Priya",  "Naidoo",   "Backend Engineer",   "priya.naidoo@lineari.dev",   "EMP-005", date(1990,  2, 14),  "78000.00", "rajesh.chetty@lineari.dev"),
    ("Sam",    "Pillay",   "Frontend Engineer",  "sam.pillay@lineari.dev",     "EMP-006", date(1992,  9,  3),  "76000.00", "rajesh.chetty@lineari.dev"),
    ("Kim",    "Moodley",  "QA Engineer",        "kim.moodley@lineari.dev",    "EMP-007", date(1994,  6, 21),  "68000.00", "rajesh.chetty@lineari.dev"),
    ("Thabo",  "Nkosi",    "Accountant",         "thabo.nkosi@lineari.dev",    "EMP-008", date(1988, 12,  8),  "72000.00", "lerato.dlamini@lineari.dev"),
    ("Naledi", "Khumalo",  "Financial Analyst",  "naledi.khumalo@lineari.dev", "EMP-009", date(1991,  4, 30),  "70000.00", "lerato.dlamini@lineari.dev"),
    ("Zanele", "Zulu",     "Operations Lead",    "zanele.zulu@lineari.dev",    "EMP-010", date(1986, 10,  2),  "82000.00", "sipho.mthembu@lineari.dev"),
    ("Aiden",  "Botha",    "Support Specialist", "aiden.botha@lineari.dev",    "EMP-011", date(1995,  8, 15),  "58000.00", "sipho.mthembu@lineari.dev"),
]


def main() -> None:
    with SessionLocal() as db:
        created = 0
        by_email: dict[str, Employee] = {}

        for name, surname, role, email, emp_no, dob, salary, manager_email in PEOPLE:
            existing = db.scalar(select(Employee).where(Employee.email == email))
            if existing:
                by_email[email] = existing
                continue

            manager = None
            if manager_email:
                manager = by_email.get(manager_email) or db.scalar(
                    select(Employee).where(Employee.email == manager_email)
                )
                if manager is None:
                    raise SystemExit(
                        f"Manager {manager_email} for {email} not found. "
                        "Check the PEOPLE order — managers must appear before their reports."
                    )

            employee = Employee(
                name=name,
                surname=surname,
                role=role,
                email=email,
                emp_number=emp_no,
                birth_date=dob,
                salary=Decimal(salary),
                manager_id=manager.id if manager else None,
            )
            db.add(employee)
            db.flush()  # assigns id
            by_email[email] = employee
            created += 1

        db.commit()
        print(f"Inserted {created} employees, skipped {len(PEOPLE) - created} (already existed).")


if __name__ == "__main__":
    main()