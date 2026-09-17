# ADR 003: Constructor Dependency Injection

## Status

Accepted

## Context

Framework-level dependency injection (e.g., Angular-style DI, Spring containers) hides the graph. Explicit constructor DI (`new Service(new Repository())`) makes the dependency graph visible at the composition root (`ApplicationContainer`).

## Decision

Use explicit constructor DI without framework.

## Consequences

- Positive: The full dependency graph is visible in `ApplicationContainer.js`. No hidden singletons.
- Negative: Manual wiring is verbose; adding new dependencies requires updating the container.
- Testing: Unit tests can inject fakes directly into service constructors.

## Evidence

- `src/app/ApplicationContainer.js` constructs every service/repository/controller.
- Tests inject mock repositories directly (`new AuthService(mockRepo, mockHasher, mockProvider)`).
