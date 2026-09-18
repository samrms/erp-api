# Architecture Overview

## Style

Modular monolith with constructor dependency injection and OOP layering.
No framework-level DI container.

## Request Flow

```
Client → Express → Middleware (Helmet, CORS, Rate Limit) → Routes (schemas + validate)
       → AuthMiddleware (JWT) → RBACMiddleware (permission) → Controllers (DTOs)
       → Services → Repositories → PostgreSQL
```

For sales: Controllers → SaleService → TransactionManager.run() → Repositories → PostgreSQL

## Modules

Each module owns `controllers/`, `dto/`, `repositories/`, `routes/`, `schemas/`,
plus `services/` and `middleware/` where needed.

| Module    | Controller          | Service          | Repository                  | Business Logic                                       |
| --------- | ------------------- | ---------------- | --------------------------- | ---------------------------------------------------- |
| auth      | AuthController      | AuthService      | PostgresAuthRepository      | Register, login, logout (blacklist), change password |
| products  | ProductController   | —                | PostgresProductRepository   | CRUD, cached catalog reads                           |
| customers | CustomerController  | —                | PostgresCustomerRepository  | CRUD                                                 |
| suppliers | SupplierController  | —                | PostgresSupplierRepository  | CRUD                                                 |
| inventory | InventoryController | InventoryService | PostgresInventoryRepository | Relative stock adjustment                            |
| sales     | SaleController      | SaleService      | PostgresSaleRepository      | Transactional creation                               |
| jobs      | JobController       | JobService       | PostgresJobRepository       | Queue integration                                    |
| users     | UserController      | UserService      | PostgresUserRepository      | Listing (admin only) and role promotion              |

## Layer Contracts

Shared base classes in `src/shared/` define each layer, and every concrete
class extends its base (`AuthController extends BaseController`,
`SaleService extends BaseService`, `PostgresProductRepository extends
BaseRepository`, `AuthMiddleware extends BaseMiddleware`):

- `BaseController`, `BaseService`, `BaseRepository`, `BaseMiddleware`
- `BaseDomainModel` (assign + touch, available for domain models)
- `BaseDatabase`, `BaseLogger`, `BaseJobQueue`, `BaseWorker`,
  `BasePasswordHasher`, `BaseTokenProvider` for infrastructure adapters
- Errors: `BaseError` → `AppError` → `ValidationError`,
  `AuthenticationError`, `AuthorizationError`, `NotFoundError`,
  `ConflictError`, `BusinessRuleError` (one file per class, re-exported
  nowhere — import from the class file directly)

## Input Boundaries

- `schemas/`: express-validator chains per endpoint, applied in routes
  before controllers run; failures become `ValidationError` with
  per-field details via the shared `validate` middleware
- `dto/`: constructors pick known fields only, so unknown request fields
  never cross the HTTP boundary (first mass-assignment layer)
- Repositories repeat the allowlist plus `undefined` filtering on update
  (second layer)

## Dependency Direction

```
app/ (composition root, Express setup)
  ↓
modules/ (business logic)
  ↓
infrastructure/ (PostgreSQL, Redis, JWT, Argon2)
```

Infrastructure never imports from modules. Modules never import another
module's controllers or routes (sale → inventory + product repositories
via constructor injection is the single exception).

## Transaction Strategy

`TransactionManager.run(callback)` acquires a PostgreSQL client, executes
`BEGIN`, runs the callback with the client, executes `COMMIT` on success
or `ROLLBACK` on failure, and releases the client in `finally`.

Repository methods accept an optional `client` parameter: `db = client || this.database`.

## Auth Model

- Public: `POST /auth/register`, `POST /auth/login`
- Authenticated: `POST /auth/logout` (revokes the token via `TokenStore`
  blacklist), `POST /auth/change-password` (requires current password)
- Registration rejects duplicates with 401 (same message as bad login, no
  user enumeration); concurrent duplicate registration maps the unique
  violation (`23505`) to the same error instead of a 500
- Admin bootstrap: with `ADMIN_EMAIL` + `ADMIN_PASSWORD` set, server boot
  seeds the `admin` role (all permissions) and user idempotently; public
  registration can never self-assign roles
- Users listing and `POST /users/:id/promote` require `user:read` and
  `user:write` respectively (admin-only in practice)

## Cache

Product catalog reads (`findAll`, `findById`) go through `RedisCache`
with write-through invalidation: item keys deleted on update/delete,
listing keys versioned by a `products:gen` counter bumped on every write.
Without Redis the cache fails open to plain database reads.

## Queue Architecture

- **BullMQJobQueue**: Enqueues jobs with 3 attempts and exponential backoff
- **BullMQWorker**: Separate process (`src/worker.js`) processes jobs
- **No outbox pattern**: Job submission is not transactional (DB insert then queue add). See ADR 008.

## Security

- Parameterized SQL queries (all repositories)
- Input validation via express-validator schemas on all routes
- DTO whitelists plus repository column allowlists (mass assignment safe)
- Argon2 password hashing
- JWT HS256 with issuer/audience validation; tampered/expired tokens are 401, never 500
- RBAC permission-based authorization
- Rate limiting (100 requests / 15 min, answered 429)
- Helmet security headers
- CORS with configurable origin
- 10KB request body limit (413 on overflow, 400 on malformed JSON)
- Password hash never returned in API responses

## Testing

- `tests/unit`: fast, isolated; infrastructure boundaries (BullMQ) via `vi.mock`
- `tests/integration/db`: real PostgreSQL on per-file cloned databases
- `tests/integration/api`: real Express app over HTTP with isolated databases
- `tests/e2e`: cross-module user journeys (purchase, catalog, jobs, credentials)
- `tests/architecture`: dependency-direction enforcement
- Global setup migrates a template DB once per run; template name is unique
  per process so overlapping runs never interfere
