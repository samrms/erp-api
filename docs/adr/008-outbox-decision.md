# ADR 008: Outbox Decision

Not implemented globally. Added only where reliable database-to-queue publication is needed. Current feature set does not require outbox; if added later, it must live inside the same database transaction.
