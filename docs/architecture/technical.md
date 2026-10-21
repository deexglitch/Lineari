# Lineari — Technical Architecture

Lineari is a full-stack employee hierarchy app: manage employees, set
reporting lines, explore the org visually, and sign in with JWT.

## Stack

| Layer          | Technology                              |
|----------------|-----------------------------------------|
| Frontend       | React 19 + Vite + TypeScript            |
| Styling        | Tailwind CSS v4 + custom tokens         |
| UI primitives  | shadcn-style atoms + Phosphor icons     |
| Graph          | `react-d3-tree` (SVG with pan/zoom)     |
| Data fetching  | TanStack Query                          |
| Backend        | FastAPI + Pydantic v2                   |
| ORM            | SQLAlchemy 2.0 (typed `Mapped`)         |
| Database       | PostgreSQL                              |
| Auth           | JWT + bcrypt + HTTP-only cookies        |
| Migrations     | Alembic                                 |

## Repository layout

```text
api/
  app/
    auth/            # settings, models, security, deps
    routers/         # auth, employees, hierarchy
    main.py          # FastAPI app + middleware
  migrations/        # Alembic
contract/
  openapi.yaml       # API contract — single source of truth
web/
  src/
    api/             # generated types + openapi-fetch client
    components/      # atoms / molecules / organisms / templates
    hooks/           # React Query wrappers + presence + theme
    lib/             # api client, tree helpers, types, formatters
    pages/           # one file per route
```

Frontend follows Atomic Design (atoms → molecules → organisms → templates
→ pages).

## Authentication

Both tokens are **HTTP-only cookies** — never `localStorage`.

- **Access token** — 15-minute JWT, `Path=/`, on every API request.
- **Refresh token** — opaque 32-byte string, `Path=/auth`, only sent to
  `/auth/*`. Stored hashed (SHA-256) in the DB.
- **Rotation** — every refresh marks the old token revoked and issues a new
  one. Replaying an old token revokes every refresh token for that user.
- **Timing** — login always runs one bcrypt check against a dummy hash if
  the email doesn't exist, so timing doesn't reveal which emails exist.

Cookie shape:

```text
lineari_access   HttpOnly; Path=/;     SameSite=Lax; Max-Age=900
lineari_refresh  HttpOnly; Path=/auth; SameSite=Lax; Max-Age=604800
```

### Cross-origin cookies

`SameSite=Lax` cookies are not sent on cross-site `fetch` requests, so the
frontend and API must be served from the same site (for example, subdomains
of one registrable domain). Set `CORS_ORIGINS` to the frontend URL and
`COOKIE_SECURE=true` in production.

### Frontend session handling

`lib/api.ts::fetchJson` centralises API calls. On 401 it triggers one
`refreshSession()` (deduplicated across concurrent requests via a shared
promise) and retries once. Login, signup, refresh, and logout are excluded
from retry. `ApiError` carries `status`, `code`, and `fieldErrors`.

### Route guards

- `RequireAuth` — blocks app routes when `/auth/me` returns null.
- `RedirectIfAuthed` — sends signed-in users past `/login` and `/signup`.

Both read from the `["me"]` query key.

## Data model

### `employees`

| Column       | Type            | Notes |
|--------------|-----------------|-------|
| `id`         | `uuid`          | primary key, `gen_random_uuid()` |
| `name`       | `varchar(100)`  | |
| `surname`    | `varchar(100)`  | |
| `email`      | `varchar(255)`  | unique |
| `birth_date` | `date`          | must be in the past |
| `emp_number` | `varchar(32)`   | unique |
| `salary`     | `numeric(12,2)` | `CHECK salary >= 0` |
| `role`       | `varchar(100)`  | |
| `manager_id` | `uuid`          | self-FK, `ON DELETE RESTRICT`, `CHECK manager_id <> id` |
| `created_at` | `timestamptz`   | |
| `updated_at` | `timestamptz`   | `onupdate=func.now()` |

### `users` and `refresh_tokens`

See `app/auth/models.py`. `refresh_tokens.token_hash` is the SHA-256 of the
opaque token; `users.hashed_password` is bcrypt with 12 rounds.

## Enforced constraints

Three spec requirements are enforced **in the database**, not just in code:

1. **Nobody is their own manager** — `CHECK manager_id <> id`.
2. **No circular reporting lines** — `_chain_contains` walks the manager
   chain with a recursive CTE before any write that changes `manager_id`,
   returning 422 if the new manager sits underneath the employee.
3. **A manager with reports can't be deleted** — `ON DELETE RESTRICT` plus
   the explicit `has_direct_reports` 409.

The delete endpoint supports two escape hatches:
`reassign_reports_to=<id>` or `reassign_to_none=true`. Both are surfaced in
`DeleteEmployeeDialog`.

## API surface

| Method | Path                          | Purpose |
|--------|-------------------------------|---------|
| POST   | `/auth/signup`                | Create user, start session |
| POST   | `/auth/login`                 | Authenticate, start session |
| POST   | `/auth/refresh`               | Rotate tokens |
| POST   | `/auth/logout`                | Revoke refresh, clear cookies |
| GET    | `/auth/me`                    | Current user |
| PATCH  | `/auth/me`                    | Update name / email |
| POST   | `/auth/me/password`           | Change password, revoke other sessions |
| GET    | `/employees`                  | Paginated, filterable, sortable list |
| POST   | `/employees`                  | Create |
| GET    | `/employees/{id}`             | Fetch one |
| PATCH  | `/employees/{id}`             | Update fields and/or manager |
| DELETE | `/employees/{id}`             | Delete with report reassignment |
| GET    | `/employees/{id}/ancestors`   | Chain of managers above |
| GET    | `/hierarchy`                  | Full tree of roots → reports |
| GET    | `/health`                     | DB connectivity check |

All routes except `/auth/*` and `/health` are wrapped in
`Depends(get_current_user)` at the router level.

Error shape:

```json
{ "code": "not_found", "message": "…", "details": { … } }
```

## Frontend architecture

### Component tree for `/organisation`

```text
OrganisationPage                ← query + view + focus state
├─ OrganisationSearch           ← controlled input
├─ ViewToggle (List | Graph)    ← persisted in localStorage
├─ OrganisationTree (List)      ← recursive <ul>
│  └─ PersonRow                 ← highlighted when id matches focus
└─ OrganisationTreeGraph (D3)   ← react-d3-tree, re-keyed on filter change
   └─ OrgChart                  ← custom <foreignObject> node
```

Both views receive the same `visible: HierarchyNode[]`, derived by:

```ts
const searched = filterTree(tree, query);        // matches keep ancestors
const visible  = pruneToPath(searched, focusId); // ?focus= prunes to one path
```

The graph remounts on data change (the key includes query + root count),
because `react-d3-tree` otherwise keeps its previous internal hierarchy.
Trade-off: pan/zoom resets on each search — acceptable at this size.

### Animation

- **Silk** — WebGL shader background for the app.
- **GhostFibers** — related shader for the auth pages.
- **Bento** — cards raise and glow-follow via `animejs`.
- **CountUp** — writes to the DOM directly to avoid re-rendering each frame.
- **Reduced motion** — every animated component checks
  `prefers-reduced-motion` and skips the animation.

### Theming

`hooks/useTheme.ts` toggles `.dark` / `.light` on `<html>`, flipping the CSS
variables in `index.css`. All Tailwind utilities (`border-border`,
`bg-background`, `text-muted-foreground`) are generated from those variables
via `@theme inline`, so nothing hard-codes a colour.

## Deployment checklist

The app is ready to deploy but URLs aren't yet provisioned:

1. **Database** — managed Postgres (Neon, Supabase, Railway) with
   `DATABASE_URL` exported.
2. **Backend** — container running `uvicorn app.main:app` with
   `CORS_ORIGINS` set to the frontend URL and `COOKIE_SECURE=true`.
3. **Frontend** — `yarn build`, served as static files; `VITE_API_URL`
   points at the backend.
4. **Migrations** — run once at deploy: `uv run alembic upgrade head`.

See [Cross-origin cookies](#cross-origin-cookies) for the cookie caveat.

## Known trade-offs

- **Refresh cookie replay revokes all sessions.** Safest, but logs the
  victim out everywhere if a token is stolen and replayed. Intentional.
- **Graph loses pan/zoom on search.** Simpler than controlled-collapse
  state, and correct.
- **Client-side search.** Fine up to a few hundred employees; beyond that,
  use `GET /employees?search=`.
- **No email verification.** Out of scope; the schema has room (`is_active`).