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

See `docs/architecture/` and ADRs.

## Commands

- `pnpm install`
- `pnpm migrate`
- `pnpm start`
- `pnpm worker`
- `pnpm test`

## Security

Parameterized SQL only. Rate limiting. Helmet. Secure JWT (HS256 only).
