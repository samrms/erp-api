# Architecture

Modular monolith with constructor dependency injection. No DI framework.

See [overview](architecture/overview.md) for the full picture and [ADRs](adr/) for decisions.

## Request Flow

```
Client → Express → Routes (schemas + validate) → AuthMiddleware (JWT)
       → RBACMiddleware (permission) → Controllers (DTOs)
       → Services → Repositories → PostgreSQL
```

## Module Pattern

Each module owns its slice — `controllers/`, `dto/`, `repositories/`,
`routes/`, `schemas/`, plus `services/` where business logic lives:

```text
src/modules/sales/
├── controllers/SaleController.js
├── dto/CreateSaleDto.js
├── repositories/PostgresSaleRepository.js
├── routes/saleRoutes.js
├── schemas/saleSchemas.js
└── services/SaleService.js
```

CRUD-only modules (products, customers, suppliers) skip the service layer:
controllers call repositories directly.

## Layer Contracts

Every concrete class extends a shared base (`AuthController extends
BaseController`, `PostgresProductRepository extends BaseRepository`).
One file per class; no barrel files — import from the class file directly.

## Boundaries

- `schemas/`: express-validator chains, applied in routes before controllers
- `dto/`: constructors pick known fields only (mass-assignment protection)
- Repositories: parameterized SQL plus column allowlists and `undefined`
  filtering on update
- `src/shared/`: errors and validation only — no framework imports
- `src/infrastructure/`: PostgreSQL, Redis, JWT, Argon2 — never imports modules
