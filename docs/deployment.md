# Deployment

## Docker

```bash
docker compose up -d     # postgres + redis
docker compose build     # rebuild api/worker images
```

The image (`node:20-alpine`) installs production dependencies and runs
`node src/main.js` (API) or `node src/worker.js` (BullMQ worker).
`docker-compose.yml` wires both to PostgreSQL and Redis.

## Production Checklist

- Set `NODE_ENV=production`
- Set a strong `JWT_SECRET`
- Set `DATABASE_URL` and `REDIS_URL`
- Run `pnpm migrate` before starting
- Set `ADMIN_EMAIL` + `ADMIN_PASSWORD` once to seed the first admin,
  then rotate the password via `/auth/change-password`
- Serve behind TLS-terminating reverse proxy

## CI/CD

`.github/workflows/ci.yml` (push/PR to `development`, `main`) runs against
PostgreSQL 16 and Redis 7 service containers:

1. `pnpm install --frozen-lockfile`
2. `pnpm lint`
3. `pnpm test:unit`
4. `pnpm test:integration`
5. `pnpm test:architecture`
6. `pnpm test:e2e`

## Operations

- Liveness: `GET /api/v1/health` — Readiness: `GET /api/v1/ready` (checks DB)
- Both API and worker shut down gracefully on `SIGTERM`/`SIGINT`
- Token revocations live in memory (`TokenStore`): use sticky sessions or
  a shared store if running multiple API replicas
