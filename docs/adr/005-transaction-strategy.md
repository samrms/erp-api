# ADR 005: Transaction Strategy

## Status

Accepted (updated)

## Context

Sales, inventory adjustments, and multi-step business operations must be atomic. Partial writes corrupt business state.

## Decision

Explicit `BEGIN/COMMIT/ROLLBACK` through `TransactionManager.run(callback)` where the callback receives a `client`. Repository methods accept an optional `client` parameter: `db = client || this.database`.

All reads inside a transaction use the transaction client (not the pool) to prevent phantom reads.

## Consequences

- Positive: Atomic multi-step operations verified by PostgreSQL transactions; rollback releases the client
- Positive: Products are fetched once before the loop in SaleService (no N+1 queries)
- Negative: Long-running transactions hold connections; consider timeout settings for production
- Testing: Integration tests verify database state after rollback

## Evidence

- `src/infrastructure/database/TransactionManager.js` implements `run()` with `BEGIN/COMMIT/ROLLBACK/finally release`
- `src/modules/sales/services/SaleService.create()` uses transaction for all reads and writes
- `src/modules/inventory/repositories/PostgresInventoryRepository.js` accepts `client` parameter on all methods
