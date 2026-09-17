# ADR 005: Transaction Strategy

## Status

Accepted

## Context

Sales, inventory adjustments, and multi-step business operations must be atomic. Partial writes (e.g., sale created but inventory not deducted) corrupt business state.

## Decision

Explicit BEGIN/COMMIT/ROLLBACK through `TransactionManager.run(callback)` where the callback receives a `client`. The repository methods (`create`, `update`, `delete`, `deductStock`, `createMovement`) accept an optional `client` parameter: `db = client || this.database`.

## Consequences

- Positive: Atomic multi-step operations verified by PostgreSQL transactions; rollback releases the client.
- Negative: `TransactionManager` depends on `database.getClient()`; connection leaks are possible if `finally { client.release() }` fails.
- Testing: Integration tests must verify database state after rollback (not just mock verification).

## Evidence

- `src/infrastructure/database/TransactionManager.js` implements `run()` with `BEGIN/COMMIT/ROLLBACK/finally release`.
- `SaleService.create()` passes `client` to `inventoryRepo.deductStock()` and `saleRepo.create()`.
