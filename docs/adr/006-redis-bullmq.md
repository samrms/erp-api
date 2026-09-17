# ADR 006: Redis + BullMQ

## Status

Accepted

## Context

Asynchronous work (job queue) requires a message broker. BullMQ provides retries, backoff, job persistence, and worker lifecycle. PostgreSQL remains the source of truth for business state; Redis failure must not corrupt inventory or sales.

## Decision

Use BullMQ over Redis for asynchronous jobs, with retries and exponential backoff.

## Consequences

- Positive: Retries (`attempts: 3`, `backoff: exponential`) improve reliability; job persistence in Redis.
- Negative: Redis dependency adds infrastructure; worker process (`src/worker.js`) must be monitored; graceful shutdown is required; poison jobs can cause retry storms.
- Security: Queue payloads are unvalidated by default; malicious payloads must be validated by the worker/job handler.

## Evidence

- `src/infrastructure/queue/BullMQJobQueue.js`: `Queue` with `attempts: 3`, `backoff: { type: 'exponential', delay: 2000 }`.
- `src/infrastructure/queue/BullMQWorker.js`: worker process handling.
- `src/worker.js`: separate entry point.
