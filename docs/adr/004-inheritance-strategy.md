# ADR 004: Inheritance Strategy

## Status

Accepted

## Context

Each architectural layer (controllers, services, repositories, middleware,
infrastructure adapters) shares a contract. Without a base class the
contract lives only in convention, and drift goes unnoticed until runtime.

## Decision

One thin base class per layer in `src/shared/` and
`src/infrastructure/*/Base*.js`. Every concrete class extends its base
(`AuthController extends BaseController`,
`PostgresProductRepository extends BaseRepository`, and so on).
Base methods throw `must be implemented`, so a missing override fails fast
instead of silently resolving to `undefined`.

## Consequences

- Positive: layer membership is explicit and checkable
  (`instanceof BaseController` in tests and code)
- Positive: single place documenting what each layer must provide
- Negative: base methods carry unused parameters (accepted ESLint warnings);
  JavaScript cannot enforce signatures at compile time
- `TransactionManager` stays standalone: no shared contract exists for it
- `BaseDomainModel` is available but currently subclass-free, since
  repositories return plain rows by design
