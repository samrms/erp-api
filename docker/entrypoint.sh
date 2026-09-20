#!/bin/sh
set -e

echo "Waiting for PostgreSQL..."
node -e "
import net from 'node:net';
const host = 'postgres';
const port = 5432;
function check() {
  return new Promise((resolve) => {
    const s = net.createConnection({ host, port });
    s.on('connect', () => { s.destroy(); resolve(true); });
    s.on('error', () => { s.destroy(); resolve(false); });
    s.setTimeout(2000, () => { s.destroy(); resolve(false); });
  });
}
let ready = false;
while (!ready) {
  ready = await check();
  if (!ready) {
    process.stdout.write('.');
    await new Promise(r => setTimeout(r, 1000));
  }
}
console.log(' ready');
"
echo "PostgreSQL is ready"

echo "Running migrations..."
node -e "
import nodePgm from 'node-pg-migrate';
await nodePgm({
  direction: 'up',
  dir: 'migrations',
  databaseUrl: process.env.DATABASE_URL,
  noLock: true,
});
console.log('Migrations applied');
"

echo "Seeding database..."
node src/infrastructure/database/seed.js

echo "Starting API..."
exec node src/main.js
