# ERP REST API

Modular monolith ERP REST API with JWT authentication, RBAC authorization, transactional sales, background jobs, and a cached product catalog.

## Quick Start

```bash
cp .env.example .env
pnpm install
pnpm migrate
pnpm dev
```

Swagger UI: http://localhost:3000/docs

Default admin (development only — change before production):

```bash
ADMIN_EMAIL=admin@erp.local ADMIN_PASSWORD=secret123 pnpm start
```

## Docs

- [Development](docs/development.md) - Setup, env vars, testing, docker
- [Architecture](docs/architecture.md) - Project structure, module pattern
- [API Reference](docs/api.md) - Endpoints, auth, roles, pagination
- [Database](docs/database.md) - Schema, tables, migrations
- [Deployment](docs/deployment.md) - Docker, CI/CD

## License

MIT
