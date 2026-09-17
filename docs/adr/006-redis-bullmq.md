# ADR 006: Redis + BullMQ

Used for asynchronous work (reports, notifications) only. PostgreSQL remains source of truth for inventory and financial state. Redis failure does not corrupt business data.
