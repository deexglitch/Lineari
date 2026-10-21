from fastapi.testclient import TestClient
from sqlalchemy import select

from app.auth.models import User
from app.db import SessionLocal
from app.main import app

client = TestClient(app)

PASSWORD = "Correct-Horse9!"
EMPLOYEE = {
    "name": "A",
    "surname": "B",
    "email": "a.b@example.com",
    "birth_date": "1990-01-01",
    "emp_number": "E1",
    "salary": 1,
    "role": "Dev",
    "manager_id": None,
}


def _signup(email: str) -> None:
    r = client.post(
        "/auth/signup",
        json={
            "email": email,
            "password": PASSWORD,
            "first_name": "Test",
            "last_name": "User",
        },
    )
    assert r.status_code == 201, r.text


def _promote(email: str) -> None:
    with SessionLocal() as db:
        u = db.scalar(select(User).where(User.email == email.lower()))
        u.role = "admin"
        db.commit()


def _login(email: str) -> None:
    r = client.post("/auth/login", json={"email": email, "password": PASSWORD})
    assert r.status_code == 200, r.text


def test_viewer_cannot_create_employee():
    _signup("viewer@example.com")
    _login("viewer@example.com")
    r = client.post("/employees", json=EMPLOYEE)
    assert r.status_code == 403
    assert r.json()["code"] == "forbidden"


def test_admin_can_create_employee():
    _signup("admin@example.com")
    _promote("admin@example.com")
    _login("admin@example.com")
    r = client.post("/employees", json=EMPLOYEE)
    assert r.status_code == 201, r.text