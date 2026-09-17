# Architecture Overview

Client -> HTTP -> Routes (class-based `Router`) -> Middleware (Auth, RBAC) -> Controllers -> Services -> Domain Models -> Repositories (PostgreSQL raw SQL) / Queue (BullMQ/Redis) / Security (Argon2 + JWT HS256).

Dependencies point inward. Domain (`BaseDomainModel`) does not import Express, pg, Redis, or BullMQ. Controllers translate HTTP; services contain business rules; repositories handle persistence; `TransactionManager` provides BEGIN/COMMIT/ROLLBACK.

Modules: auth, users, customers, suppliers, products, inventory, sales, jobs. All modules have controllers, services, repositories, DTOs, schemas, models, routes.

Performance: `tests/performance/` covers database bulk/select/pagination/filtering/sorting/aggregation/indexes; module volume; concurrency; queue throughput; API load. Data: `tests/data/factories/`, `tests/data/generators/`, `tests/data/datasets/` (small/medium/large/xlarge).

Tests: 132 files, 146 passing (unit, integration, e2e, security, concurrency, architecture, contracts, performance, helpers). No placeholder tests (`expect(true)` removed).
