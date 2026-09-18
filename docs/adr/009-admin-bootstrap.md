# ADR 009: Admin Bootstrap Seed

## Status

Accepted

## Context

RBAC needs at least one privileged user, but public registration must never
grant roles — otherwise anyone self-promotes to admin. This is a
chicken-and-egg problem: role assignment requires an admin, and the first
admin cannot come from a protected endpoint.

## Decision

Seed-on-boot, gated by environment: when `ADMIN_EMAIL` and
`ADMIN_PASSWORD` are both set, server startup creates the `admin` role
with every system permission plus the admin user, idempotently
(find-or-create each piece; re-runs only top up missing links).
Without both variables, boot proceeds with no seeding.

## Consequences

- Positive: no privileged endpoint needed for the first admin; no default
  credentials hardcoded anywhere
- Positive: idempotent, safe to run on every deploy and restart
- Negative: initial credentials live in env/secrets management, which must
  be handled by the operator
- User promotion afterwards goes through `POST /users/:id/promote`
  (requires `user:write`), never through public registration
