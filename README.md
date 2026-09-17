# ERP REST API

Portfolio-grade modular monolith ERP REST API built with Node.js, Express, PostgreSQL, BullMQ, and Redis.

## Features

- Authentication (Argon2 + JWT)
- RBAC authorization
- Products, Customers, Suppliers, Inventory, Sales
- Transactional sale creation with concurrency control
- Asynchronous job queue with retries and idempotency
- Health, readiness, Swagger docs

## Stack

Node.js 20+, Express, PostgreSQL (raw SQL), BullMQ, Redis, Docker

## Architecture

Modular monolith with constructor DI. Routes use class-based `Router()` (see `docs/adr/003-constructor-di.md`, `docs/adr/004-inheritance-strategy.md`).

Structure:

```
Client -> HTTP (Express) -> Routes (class) -> Middleware (Auth, RBAC) -> Controllers -> Services -> Domain Models -> Repositories (PostgreSQL) / Queue (BullMQ/Redis)
```

See `docs/architecture/` and ADRs. Migrations: `migrations/`. Tests: `tests/` (unit, integration, e2e, security, concurrency, architecture, contracts, performance, helpers, data).
Modular monolith with constructor DI. Routes use class-based `Router()` (see `docs/adr/003-constructor-di.md`, `docs/adr/004-inheritance-strategy.md`).

Structure:

```
Client -> HTTP (Express) -> Routes (class) -> Middleware (Auth, RBAC) -> Controllers -> Services -> Domain Models -> Repositories (PostgreSQL) / Queue (BullMQ/Redis)
```

See `docs/architecture/` and ADRs. Migrations: `migrations/`. Tests: `tests/` (unit, integration, e2e, security, concurrency, architecture, contracts, performance, helpers, data).
Modular monolith with constructor DI. Routes use class-based `Router()` (see `docs/adr/003-constructor-di.md`, `docs/adr/004-inheritance-strategy.md`).

Structure:

```
Client -> HTTP (Express) -> Routes (class) -> Middleware (Auth, RBAC) -> Controllers -> Services -> Domain Models -> Repositories (PostgreSQL) / Queue (BullMQ/Redis)
```

See `docs/architecture/` and ADRs. Migrations: `migrations/`. Tests: `tests/` (unit, integration, e2e, security, concurrency, architecture, contracts, performance, helpers, data).
Modular monolith with constructor DI. Routes use class-based `Router()` (see `docs/adr/003-constructor-di.md`, `docs/adr/004-inheritance-strategy.md`).

Structure:

```
Client -> HTTP (Express) -> Routes (class) -> Middleware (Auth, RBAC) -> Controllers -> Services -> Domain Models -> Repositories (PostgreSQL) / Queue (BullMQ/Redis)
```

See `docs/architecture/` and ADRs. Migrations: `migrations/`. Tests: `tests/` (unit, integration, e2e, security, concurrency, architecture, contracts, performance, helpers, data).
Modular monolith with constructor DI. Routes use class-based `Router()` (see `docs/adr/003-constructor-di.md`, `docs/adr/004-inheritance-strategy.md`).

Structure:

```
Client -> HTTP (Express) -> Routes (class) -> Middleware (Auth, RBAC) -> Controllers -> Services -> Domain Models -> Repositories (PostgreSQL) / Queue (BullMQ/Redis)
```

See `docs/architecture/` and ADRs. Migrations: `migrations/`. Tests: `tests/` (unit, integration, e2e, security, concurrency, architecture, contracts, performance, helpers, data).
Modular monolith with constructor DI. Routes use class-based `Router()` (see `docs/adr/003-constructor-di.md`, `docs/adr/004-inheritance-strategy.md`).

Structure:

```
Client -> HTTP (Express) -> Routes (class) -> Middleware (Auth, RBAC) -> Controllers -> Services -> Domain Models -> Repositories (PostgreSQL) / Queue (BullMQ/Redis)
```

See `docs/architecture/` and ADRs. Migrations: `migrations/`. Tests: `tests/` (unit, integration, e2e, security, concurrency, architecture, contracts, performance, helpers, data).

## Commands

- `pnpm install`
- `pnpm migrate:up` / `pnpm migrate:down`
- `pnpm start`
- `pnpm worker`
- `pnpm test`
- `pnpm test:unit`
- `pnpm test:integration`
- `pnpm test:e2e`
- `pnpm test:security`
- `pnpm test:concurrency`
- `pnpm test:architecture`
- `pnpm test:queue`
- `pnpm test:full`
- `pnpm format`
- `pnpm lint`

## Security

Parameterized SQL only. Rate limiting. Helmet. Secure JWT (HS256 only).
