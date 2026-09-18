# Database

PostgreSQL with raw parameterized SQL (no ORM), via `pg` connection pool
(max 20, 5s connect timeout).

## Tables

| Table                 | Purpose                                          |
| --------------------- | ------------------------------------------------ |
| `users`               | Accounts (`password_hash` never exposed)         |
| `roles`               | Named roles (`admin` seeded on boot)             |
| `permissions`         | Permission codes (`product:read`, …)             |
| `user_roles`          | User ↔ role links (composite PK)                 |
| `role_permissions`    | Role ↔ permission links (composite PK)           |
| `products`            | Catalog (`sku` unique, `price` numeric(12,2))    |
| `customers`           | Customer records                                 |
| `suppliers`           | Supplier records                                 |
| `inventory`           | One row per product (`product_id` unique)        |
| `inventory_movements` | Immutable stock movement log                     |
| `sales`               | Sale headers with `total_amount`                 |
| `sale_items`          | Sale line items (cascade on sale delete)         |
| `jobs`                | Background job records (`pending` → `completed`) |
| `pgmigrations`        | Migration history (managed by node-pg-migrate)   |

## Migrations

CommonJS files in `migrations/` (`.cjs`, since the project is ESM),
applied with node-pg-migrate:

```bash
pnpm migrate       # up
pnpm migrate:down  # roll back one step
```

## Test Databases

Integration tests never touch dev data. On each run, global setup migrates
a template database once; every test file clones an isolated copy and drops
it afterwards. The template name is unique per process
(`ERP_TEST_TEMPLATE`), so overlapping runs never interfere.
