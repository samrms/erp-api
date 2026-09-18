# Development

## Prerequisites

- Node.js 20+
- pnpm 10+
- Docker (PostgreSQL 16 + Redis 7)

## Setup

```bash
cp .env.example .env
pnpm install
docker compose up -d
pnpm migrate
pnpm dev
```

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `pnpm dev`          | API with file watching (port 3000)       |
| `pnpm start`        | API (production mode)                    |
| `pnpm worker`       | BullMQ background worker (separate proc) |
| `pnpm migrate`      | Run database migrations                  |
| `pnpm migrate:down` | Roll back last migration                 |

## Environment Variables

| Variable            | Default                                                | Description                         |
| ------------------- | ------------------------------------------------------ | ----------------------------------- |
| `NODE_ENV`          | `development`                                          | `development`, `test`, `production` |
| `PORT`              | `3000`                                                 | API port                            |
| `DATABASE_URL`      | `postgres://postgres:postgres@localhost:5432/erp_dev`  | PostgreSQL connection               |
| `TEST_DATABASE_URL` | `postgres://postgres:postgres@localhost:5432/erp_test` | Test database                       |
| `REDIS_URL`         | `redis://localhost:6379`                               | Redis (queue + cache; optional)     |
| `JWT_SECRET`        | _(required)_                                           | HS256 signing secret                |
| `JWT_ISSUER`        | `erp-api`                                              | Token issuer claim                  |
| `JWT_AUDIENCE`      | `erp-api`                                              | Token audience claim                |
| `JWT_EXPIRES_IN`    | `1h`                                                   | Token lifetime                      |
| `ADMIN_EMAIL`       | _(unset)_                                              | Seeds default admin on boot if set  |
| `ADMIN_PASSWORD`    | _(unset)_                                              | Seeds default admin on boot if set  |

Without `ADMIN_EMAIL` + `ADMIN_PASSWORD`, boot proceeds with no seeding.

## Testing

```bash
pnpm test                # everything (unit + integration + architecture + e2e)
pnpm test:unit           # no infrastructure needed
pnpm test:integration    # needs PostgreSQL; each file clones an isolated database
pnpm test:architecture   # dependency-direction enforcement
pnpm test:e2e            # cross-module journeys over HTTP
pnpm test:watch          # watch mode
```

Integration tests need PostgreSQL only — no Redis required (queue is stubbed,
cache fails open). Per-run template databases keep parallel and overlapping
runs isolated (see [Database](database.md)).

## Lint & Format

```bash
pnpm lint         # eslint src/ tests/
pnpm lint:fix     # eslint --fix
pnpm lint:check   # prettier --check
```

## Docker

```bash
docker compose up -d    # postgres + redis
docker compose down     # stop all
```
