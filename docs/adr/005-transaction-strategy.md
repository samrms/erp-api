# ADR 005: Transaction Strategy

Sale creation uses an explicit BEGIN/COMMIT/ROLLBACK through `TransactionManager`. Row-level locks via `SELECT FOR UPDATE` or atomic updates prevent overselling.
