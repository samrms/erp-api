# API Reference

Full interactive reference with schemas: `GET /docs` (Swagger UI),
raw OpenAPI JSON: `GET /docs/openapi.json`.

## Auth

| Method | Path                           | Auth | Description                    |
| ------ | ------------------------------ | ---- | ------------------------------ |
| POST   | `/api/v1/auth/register`        | No   | Register (never assigns roles) |
| POST   | `/api/v1/auth/login`           | No   | Returns `{ token, user }`      |
| POST   | `/api/v1/auth/logout`          | Yes  | Revokes the current token      |
| POST   | `/api/v1/auth/change-password` | Yes  | Requires `currentPassword`     |

Send the JWT as `Authorization: Bearer <token>`.

## Resources

| Module    | Permission       | Endpoints                                                                  |
| --------- | ---------------- | -------------------------------------------------------------------------- |
| Products  | `product:read`   | `GET/POST /products`, `GET/PATCH/DELETE /products/:id`                     |
| Customers | `customer:read`  | `GET/POST /customers`, `GET/PATCH/DELETE /customers/:id`                   |
| Suppliers | `supplier:read`  | `GET/POST /suppliers`, `GET/PATCH/DELETE /suppliers/:id`                   |
| Sales     | `sale:read`      | `GET/POST /sales`, `GET /sales/:id` (atomic stock deduction)               |
| Inventory | `inventory:read` | `GET /inventory/:productId`, `PATCH /:productId/adjust`, `POST /movements` |
| Jobs      | `job:read`       | `POST /jobs` (202), `GET /jobs/:id`                                        |
| Users     | `user:read`      | `GET /users`, `GET /users/:id`                                             |
| Users     | `user:write`     | `POST /users/:id/promote` (`{ "role": "admin" }`)                          |
| Health    | —                | `GET /api/v1/health`, `GET /api/v1/ready`                                  |

## Roles

The `admin` role (seeded on boot with `ADMIN_EMAIL` + `ADMIN_PASSWORD`)
holds every permission. Public registration grants no roles; promotion
goes through `POST /users/:id/promote` (409 if already assigned).

## Pagination

List endpoints accept `limit` (1–100, default 20) and `offset` (default 0).
Products additionally support `search`, `sortField`, and `sortOrder`.

## Errors

Consistent envelope, never leaking internals outside development:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [{ "field": "email", "message": "Valid email is required" }],
    "requestId": "-"
  }
}
```

| Status | Meaning                                          |
| ------ | ------------------------------------------------ |
| 400    | Validation failed, malformed JSON                |
| 401    | Missing, invalid, expired, or revoked token      |
| 403    | Authenticated but lacking the permission         |
| 404    | Unknown resource                                 |
| 409    | Conflict (e.g. role already assigned)            |
| 413    | Body over the 10KB limit                         |
| 422    | Business rule violated (e.g. insufficient stock) |
| 429    | Rate limited (100 requests / 15 min)             |
| 500    | Unexpected failure (message masked outside dev)  |
