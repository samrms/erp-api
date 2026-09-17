# ADR 007: Worker Process

Separate `src/worker.js` from `src/main.js`. Worker uses same domain/application code but never depends on Express controllers.
