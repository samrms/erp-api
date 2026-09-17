# Architecture Overview

Client -> HTTP -> Routes -> Middleware -> Controllers -> Services -> Domain -> Repositories -> PostgreSQL / Queue / Security.
Dependencies point inward. Domain never imports Express, pg, BullMQ, JWT, or Argon2.
