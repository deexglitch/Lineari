<div align="center">

<img src="assets/banner.svg" alt="Lineari: employee hierarchy, made visible" width="100%">

<br>

![React](https://img.shields.io/badge/React_19-0B6E6A?style=for-the-badge&logo=react&logoColor=B6D777)
![TypeScript](https://img.shields.io/badge/TypeScript-2B1D3A?style=for-the-badge&logo=typescript&logoColor=D5E3DF)
![Vite](https://img.shields.io/badge/Vite-0B6E6A?style=for-the-badge&logo=vite&logoColor=B6D777)
![FastAPI](https://img.shields.io/badge/FastAPI-2B1D3A?style=for-the-badge&logo=fastapi&logoColor=D5E3DF)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-0B6E6A?style=for-the-badge&logo=postgresql&logoColor=B6D777)
![OpenAPI](https://img.shields.io/badge/OpenAPI-F2674A?style=for-the-badge&logo=openapiinitiative&logoColor=2B1D3A)

**Create and manage employees, set reporting lines, explore the org chart visually, and keep employee information in one place.**

[Technical architecture](docs/architecture/technical.md) · [User guide](docs/architecture/user-guide.md) · [Brand identity](docs/design/brand-identity)

</div>

---

## Features

| Feature | What it does |
|---|---|
| **Employee directory** | Create, read, update and delete employees with search, filtering, sorting and pagination. |
| **Reporting lines** | Assign any employee a manager, with automatic guards against self-management and circular reporting chains. |
| **Organisation chart** | Nested hierarchy view with expand/collapse, live search and a level count. |
| **Overview dashboard** | Total employees, top-level roles and reporting-link counts, animated with a count-up. |
| **Gravatar avatars** | Derived automatically from each employee's email. |
| **Safe deletes** | Deleting a manager requires reassigning their direct reports (or explicitly orphaning them). |
| **Friendly errors** | The API returns a stable `{ code, message }` shape that the frontend maps to human-readable messages. |

<div align="center">
  <img src="assets/org-chart.svg" alt="Organisation chart preview" width="85%">
</div>

---

## Architecture

The OpenAPI contract in [`contract/openapi.yaml`](contract/openapi.yaml) is the **source of truth**. The frontend types are generated from it, and the backend is implemented to match it.

<div align="center">
  <img src="assets/architecture.svg" alt="Lineari architecture diagram" width="90%">
</div>

### Tech stack

| Layer | Tools |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, TanStack Query, React Router, openapi-fetch, Base UI, Phosphor icons, anime.js |
| **Backend** | FastAPI, SQLAlchemy 2, Pydantic v2, Alembic, psycopg 3 |
| **Database** | PostgreSQL (UUID primary keys via `gen_random_uuid()`) |
| **Tooling** | just, uv, yarn 4, Redocly, openapi-typescript |

---

## Getting started

### Prerequisites

- **Node 20+** and **Yarn 4** (via Corepack: `corepack enable`)
- **Python 3.12+**
- **[uv](https://docs.astral.sh/uv/)**: `curl -LsSf https://astral.sh/uv/install.sh | sh`
- **[just](https://github.com/casey/just)**: `brew install just` / `winget install Casey.Just` / `cargo install just`
- **PostgreSQL** running locally or remotely

### One-time setup

```bash
just setup
```

This installs frontend and backend dependencies and copies `.env.example` to `.env`. Open `.env` and paste your database URL:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/lineari
CORS_ORIGINS=http://localhost:5173
VITE_API_URL=http://localhost:8000
```

### Every day

```bash
just dev
```

This runs migrations, then starts the API (<http://localhost:8000>) and the frontend (<http://localhost:5173>) in parallel.

### Useful commands

```bash
just                            # list every command
just migrate                    # apply database migrations
just migration "add new field"  # create a new migration from model changes
just types                      # regenerate src/api/schema.d.ts from the OpenAPI contract
just lint-contract              # validate contract/openapi.yaml
just test                       # run backend tests
just check                      # lint contract + regen types + run tests
```

---

## Project structure

```text
.
├── api/                        # FastAPI backend
│   ├── app/
│   │   ├── routers/
│   │   │   ├── employees.py    # CRUD + filtering + circular-line checks
│   │   │   └── hierarchy.py    # GET /hierarchy (nested tree)
│   │   ├── config.py           # pydantic-settings (reads ../.env)
│   │   ├── db.py               # engine, Base, get_db dependency
│   │   ├── errors.py           # AppError + validation handler
│   │   ├── gravatar.py         # sha256 email → gravatar URL
│   │   ├── main.py             # app factory + CORS + /health
│   │   ├── models.py           # Employee SQLAlchemy model
│   │   └── schemas.py          # Pydantic request/response models
│   ├── migrations/             # Alembic revisions
│   └── pyproject.toml
│
├── contract/
│   └── openapi.yaml            # The source of truth for the API
│
└── web/                        # Vite + React frontend
    ├── src/
    │   ├── api/
    │   │   ├── client.ts       # openapi-fetch client
    │   │   └── schema.d.ts     # generated types (do not edit)
    │   ├── components/
    │   │   ├── atoms/          # avatar, badge, button, count-up, logo, skeleton, status-dot
    │   │   ├── molecules/      # bento-card, bento-grid, form-field, person-row, profile-card, ...
    │   │   ├── organisms/      # top-nav, organisation-tree, add-employee form/dialog, overview hero/stats
    │   │   ├── templates/      # app-layout
    │   │   └── vendor/         # PillNav, Silk (self-contained visual primitives)
    │   ├── effects/            # Silk background wrapper
    │   ├── hooks/              # useEmployees, useHierarchy, useCreateEmployee, useApiHealth
    │   ├── lib/                # api client helpers, tree utils, formatters, types, constants
    │   ├── pages/              # overview-page, organisation-page
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── public/
    ├── index.html              # Vite entry point (must live here, not in src/)
    ├── vite.config.ts
    └── package.json
```

---

## The API

The full contract lives at [`contract/openapi.yaml`](contract/openapi.yaml). Once the API is running, interactive docs are at <http://localhost:8000/docs>.

### Endpoints

| Method | Path | Purpose |
|---|---|
| `GET` | `/health` | Service + DB health |
| `GET` | `/employees` | List with search, filters, sort, pagination |
| `POST` | `/employees` | Create an employee |
| `GET` | `/employees/{id}` | Fetch one employee |
| `PATCH` | `/employees/{id}` | Update fields or change the manager |
| `DELETE` | `/employees/{id}` | Delete (must reassign or orphan direct reports) |
| `GET` | `/employees/{id}/ancestors` | Chain of managers above a person |
| `GET` | `/hierarchy` | The org chart as a nested tree |

### Error shape

All errors conform to:

```json
{ "code": "duplicate_email", "message": "This email is already in use" }
```

Possible `code` values:

`not_found` · `validation_error` · `duplicate_employee_number` · `duplicate_email` · `self_manager` · `circular_reporting_line` · `has_direct_reports`

### Business rules

- `manager_id` is nullable (top-level employees). It may not equal the employee's own `id`.
- Reporting chains are checked with a **recursive CTE**, so no cycles are allowed.
- `email` is case-insensitively unique; `emp_number` is unique.
- Deleting an employee with direct reports fails with `409 has_direct_reports` unless you pass `?reassign_reports_to=<uuid>` or `?reassign_to_none=true`.
- `birth_date` must be in the past.

---

## Database

Migrations live in `api/migrations/versions/` and are applied with `just migrate`.

<div align="center">
  <img src="assets/data-model.svg" alt="Employee table and constraints" width="85%">
</div>

- The `employee` table has two DB-level constraints: `manager_id IS NULL OR manager_id <> id` and `salary >= 0`.
- `ON DELETE RESTRICT` on the manager FK means the database itself refuses to orphan reports, as a backstop to the API check.

---

## Changing the API

The contract is the source of truth. Update in this order:

1. Edit `contract/openapi.yaml`.
2. Regenerate the frontend types: `just types`.
3. Update the backend router and schemas in `api/app/` to match.
4. If the schema changed, create a migration: `just migration "describe change"`.
5. Validate: `just check`.

---

## Frontend conventions

Components are organised by responsibility, from smallest to largest:

| Folder | Role |
|---|---|
| `atoms/` | Single-purpose UI (button, avatar, badge, skeleton). |
| `molecules/` | Atoms composed together (person-row, profile-card, form-field). |
| `organisms/` | Feature-aware components that may fetch data or own UI state. |
| `templates/` | Layout shells (`app-layout` wraps `Outlet`). |
| `pages/` | Thin compositions that wire hooks to organisms. |
| `effects/` & `vendor/` | Self-contained visual primitives (WebGL background, animated nav). |

> **Rules of thumb**
> - Data fetching lives in `hooks/`, **never** inside atoms or molecules.
> - Shared logic lives in `lib/` (pure functions, no React).

---

## License

Private project. No license declared.