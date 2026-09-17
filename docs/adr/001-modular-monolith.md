# ADR 001: Modular Monolith

## Status

Accepted

## Context

ERP domain requires strong transactional consistency across inventory, sales, customers, and suppliers. Network partitions would break financial integrity (e.g., a sale deducted inventory but did not persist due to a network failure between service and database).

## Decision

Choose a modular monolith over microservices.

## Consequences

- Positive: ACID transactions span modules; no distributed transaction complexity; simpler deployment.
- Negative: Module isolation is logical, not physical; requires discipline to avoid cross-module database access.
- Migration path: If a module (e.g., jobs) needs independent scaling, it can be extracted later because domain interfaces are defined.

## Evidence

- `docs/architecture/overview.md` defines module boundaries.
- `TransactionManager.js` provides cross-module atomic operations via PostgreSQL.
