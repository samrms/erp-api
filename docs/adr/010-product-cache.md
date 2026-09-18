# ADR 010: Redis Product Catalog Cache

## Status

Accepted

## Context

Product reads (catalog listing, single-product fetch, price lookups inside
sale creation) dominate database traffic, while product writes are rare
and always flow through `PostgresProductRepository`.

## Decision

Cache behind the repository behind `RedisCache` (`get`/`set`/`del`/`incr`,
`erp:` key prefix, JSON values):

- `findById` → `product:{id}`, 60s TTL, deleted on update/delete
- `findAll` → `products:list:{gen}:{params}`, 30s TTL, versioned by a
  `products:gen` counter bumped on every write
- Every operation fails open: without Redis (or on any Redis error, with a
  5s cooldown) the repository behaves exactly as if no cache existed

## Consequences

- Positive: hot catalog reads avoid PostgreSQL; sale pricing stays correct
  because every write path invalidates (TTL is only a backstop)
- Positive: local development and tests run unchanged with no Redis
- Negative: listing keys from old generations linger until TTL expiry
  (bounded, small, and never served once generation bumps)
- Not cached: inventory, sales, and auth reads, where staleness or extra
  roundtrips carry real business risk
