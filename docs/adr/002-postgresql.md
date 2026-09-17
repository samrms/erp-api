# ADR 002: PostgreSQL

## Status

Accepted

## Context

PostgreSQL supports raw parameterized SQL (`$1`), ACID transactions, foreign keys, CHECK constraints, and custom indexes. Using raw SQL instead of an ORM maintains control over query plans, indexing strategies, and transaction isolation.

## Decision

Use PostgreSQL with raw parameterized SQL (no ORM).

## Consequences

- Positive: Query performance is transparent; indexes are explicit; SQL injection resistance is enforced by parameterization; transaction isolation is directly controllable.
- Negative: More boilerplate in repositories; schema changes require migration files; less abstraction over query syntax.
- Security: Every repository must use parameterized queries (`$1`, `$2`, etc.). Dynamic ORDER BY or column selection requires allowlists.

## Evidence

- `migrations/` defines schema evolution.
- `Postgres*Repository.js` files use `pg` parameterization.
