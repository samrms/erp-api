# ERP API

Modular monolith / JS / Express / PostgreSQL / raw SQL / pnpm

## Architecture

- Dependency Inversion: services depend on repository abstractions
- DI via ApplicationContainer (no factories)
- Encapsulation: private fields in domain objects
- Transactions: InventoryService, SaleService use TransactionManager
- Security: Argon2 + JWT + RBAC + parameterized SQL + rate limit

## Commands

pnpm install
pnpm db:migrate
pnpm dev

## Docker

docker-compose up
