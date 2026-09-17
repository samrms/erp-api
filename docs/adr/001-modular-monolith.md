# ADR 001: Modular Monolith

Choosing a modular monolith over microservices because the problem domain (ERP) requires strong transactional consistency across inventory, sales, and customers. Network partitioning would break critical financial operations.
