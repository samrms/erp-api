# ADR 004: Inheritance Strategy

## Status

Accepted (with limits)

## Context

Base abstractions (`BaseController`, `BaseService`, `BaseRepository`, `BaseDomainModel`, `BaseMiddleware`, `BasePasswordHasher`, `BaseTokenProvider`, `BaseJobQueue`, `BaseWorker`) provide shared contracts (method signatures, constructor patterns, error handling).

## Decision

Use inheritance only for contracts that are genuinely shared. Domain models extend `BaseDomainModel`; services extend `BaseService`; repositories extend `BaseRepository`. No universal base exists.

## Consequences

- Positive: Subclasses inherit consistent APIs; polymorphism works for middleware (`AuthMiddleware`, `RBACMiddleware`).
- Negative: Some bases (`BaseDomainModel`) add minimal value; inheritance can obstruct composition if overused.
- Recommendation: If a module needs different domain behavior, prefer composition over deeper inheritance.

## Evidence

- `src/shared/domain/BaseDomainModel.js` provides `touch()`, `validate()`, `toJSON()`.
- `src/shared/http/BaseController.js` defines `findAll`, `findById`, `create`, `update`, `delete` contracts.
