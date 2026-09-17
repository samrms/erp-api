# ERP REST API

Portfolio-grade modular monolith ERP REST API built with Node.js, Express, PostgreSQL, BullMQ, and Redis.

## Features

- Authentication (Argon2 + JWT HS256)
- RBAC authorization (permission-based)
- Products, Customers, Suppliers, Inventory, Sales
- Transactional sale creation with atomic inventory deduction (BEGIN/COMMIT/ROLLBACK)
- Asynchronous job queue with retries and exponential backoff (BullMQ)
- Health and readiness probes
- OpenAPI 3.0.3 documentation with Swagger UI

## Stack

Node.js 20+, Express, PostgreSQL (raw parameterized SQL), BullMQ, Redis, Docker

## Architecture

Modular monolith with constructor DI. Routes use class-based `Router()`.

```
Client → HTTP (Express) → Routes → Middleware (Auth, RBAC) → Controllers → Services → Domain Models → Repositories (PostgreSQL) / Queue (BullMQ/Redis)
```

See `docs/architecture/` and ADRs (`docs/adr/`).

## Getting Started

```bash
pnpm install
docker compose up -d        # Start PostgreSQL + Redis
pnpm migrate:up              # Run migrations
pnpm start                   # Start API server (port 3000)
pnpm worker                  # Start background worker
```

## API Documentation

**Swagger UI:** http://localhost:3000/docs

**OpenAPI JSON:** http://localhost:3000/docs/openapi.json

### Using Authentication in Swagger

1. Register via **POST /auth/login** to obtain a JWT token
2. Click the **Authorize** button at the top of the Swagger UI
3. Enter your token (without the "Bearer " prefix)
4. All protected endpoints now include the `Authorization: Bearer <token>` header

### Public Endpoints

- `GET /health` — Liveness probe
- `GET /ready` — Readiness probe (checks DB connectivity)
- `POST /auth/register` — Register a new user
- `POST /auth/login` — Authenticate and receive JWT

### Protected Endpoints

All other endpoints require a valid JWT with appropriate RBAC permissions:

| Module    | Permission       | Endpoints                                                 |
| --------- | ---------------- | --------------------------------------------------------- |
| Products  | `product:read`   | CRUD on `/api/v1/products`                                |
| Customers | `customer:read`  | CRUD on `/api/v1/customers`                               |
| Suppliers | `supplier:read`  | CRUD on `/api/v1/suppliers`                               |
| Sales     | `sale:read`      | List, get, create on `/api/v1/sales`                      |
| Inventory | `inventory:read` | List, get, create movement, adjust on `/api/v1/inventory` |
| Jobs      | `job:read`       | Submit, get status on `/api/v1/jobs`                      |

### Updating API Documentation

API documentation is defined centrally in:

- **Schemas:** `src/infrastructure/http/swagger.schemas.js`
- **Paths:** `src/infrastructure/http/swagger.paths.js`

When adding a new endpoint, add the path definition to `swagger.paths.js`. When adding a new model, add the schema to `swagger.schemas.js`.

## Commands

| Command                  | Description                 |
| ------------------------ | --------------------------- |
| `pnpm install`           | Install dependencies        |
| `pnpm migrate:up`        | Run database migrations     |
| `pnpm migrate:down`      | Rollback last migration     |
| `pnpm start`             | Start API server            |
| `pnpm worker`            | Start background worker     |
| `pnpm test`              | Run all tests               |
| `pnpm test:unit`         | Unit tests only             |
| `pnpm test:integration`  | Integration tests           |
| `pnpm test:e2e`          | End-to-end tests            |
| `pnpm test:security`     | Security tests              |
| `pnpm test:concurrency`  | Concurrency tests           |
| `pnpm test:architecture` | Architecture boundary tests |
| `pnpm test:queue`        | Queue tests                 |
| `pnpm format`            | Format code with Prettier   |
| `pnpm lint`              | Lint with ESLint            |

## Security

- Parameterized SQL queries only (no string concatenation)
- Rate limiting (100 requests / 15 min window)
- Helmet security headers
- CORS with configurable origin
- JWT HS256 authentication
- RBAC permission-based authorization
- Password hashing with Argon2
- 10KB request body limit

## Docker

```bash
docker compose up -d       # PostgreSQL + Redis + API + Worker
docker compose down         # Stop all services
```

Services:

- `postgres` — PostgreSQL 16 (port 5432)
- `redis` — Redis 7 (port 6379)
- `api` — Express API (port 3000)
- `worker` — BullMQ worker process
