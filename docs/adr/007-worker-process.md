# ADR 007: Worker Process

## Status

Accepted

## Context

Background work (job processing, reports) should not block the HTTP server. A separate process allows independent scaling and failure isolation.

## Decision

Separate `src/worker.js` from `src/main.js`. Worker uses the same domain/application/infrastructure code but never depends on Express controllers or middleware.

## Consequences

- Positive: Worker crashes do not affect the API; independent deployment; same code base reduces duplication.
- Negative: Two processes to monitor; worker must handle graceful shutdown (`close()` for BullMQ queue/worker); no shared memory.

## Evidence

- `src/worker.js`: worker entry point.
- `src/infrastructure/queue/BullMQWorker.js`: worker class.
