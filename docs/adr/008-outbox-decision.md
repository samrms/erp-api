# ADR 008: Outbox Decision

## Status

Not globally implemented

## Context

Publishing events to an external message broker from within a database transaction can lead to inconsistency if the transaction rolls back after publication. The outbox pattern solves this by writing events to a database table within the same transaction.

## Decision

Not implemented globally. Only added where reliable database-to-queue publication is needed. The current feature set (sales, inventory, jobs) does not require outbox because BullMQ retries and idempotency are sufficient for basic asynchronous work.

## Consequences

- Positive: Reduced complexity; no outbox table needed.
- Negative: If a database transaction rolls back after a BullMQ job is enqueued, the job may process stale or missing state. For high-reliability requirements, an outbox table must be added inside the transaction.
- If added later: must live inside the same database transaction (`BEGIN ... INSERT outbox ... COMMIT`).

## Evidence

- `docs/adr/008-outbox-decision.md`: this ADR.
- `Sales` uses `TransactionManager` but does not enqueue BullMQ jobs inside the transaction; if future requirements need outbox, it must be added to the same `run()` block.
