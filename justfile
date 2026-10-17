# Run `just` with no arguments to list every command.
set dotenv-load := true
set windows-shell := ["powershell.exe", "-NoLogo", "-Command"]

default:
    @just --list

# ONE-TIME SETUP: install everything and create your .env file
setup: install env
    @echo "Setup done. Open .env, paste your DATABASE_URL, then run: just dev"

# EVERY DAY: migrate the database, then start the API and frontend together
dev: migrate start

[parallel]
start: api web

# Install frontend and backend dependencies
install: install-web install-api

[working-directory: 'web']
install-web:
    yarn install

[working-directory: 'api']
install-api:
    uv sync

# Create .env from the template if it does not exist yet
[unix]
env:
    test -f .env || cp .env.example .env

[windows]
env:
    if (-not (Test-Path .env)) { Copy-Item .env.example .env }

# Start the FastAPI dev server (http://localhost:8000)
[working-directory: 'api']
api:
    uv run uvicorn app.main:app --reload

# Start the React dev server
[working-directory: 'web']
web:
    yarn dev

# Lint the OpenAPI contract
[working-directory: 'web']
lint-contract:
    yarn redocly lint ../contract/openapi.yaml

# Regenerate the frontend TypeScript types from the contract
[working-directory: 'web']
types:
    yarn openapi-typescript ../contract/openapi.yaml -o src/api/schema.d.ts

# Run backend tests
[working-directory: 'api']
test:
    uv run pytest

# Apply database migrations
[working-directory: 'api']
migrate:
    uv run alembic upgrade head

# Create a migration from model changes: just migration "add employees table"
[working-directory: 'api']
migration name:
    uv run alembic revision --autogenerate -m "{{name}}"

# Check everything before you commit
check: lint-contract types test
