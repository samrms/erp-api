import pg from "pg";
import { PostgresDatabase } from "../../src/infrastructure/database/PostgresDatabase.js";
import { TEMPLATE_DB, baseUrl } from "./global-setup.js";

function withDb(db) {
  const u = new URL(baseUrl());
  u.pathname = `/${db}`;
  return u.toString();
}

export function dbNameFor(label) {
  const base = label
    .split("/")
    .pop()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);
  return `erp_test_${base}`;
}

export async function createIsolatedDb(label) {
  const name = dbNameFor(label);
  const admin = new pg.Client({
    connectionString: withDb("postgres"),
    connectionTimeoutMillis: 5000,
  });
  await admin.connect();
  try {
    await admin.query(`DROP DATABASE IF EXISTS "${name}"`);
    await admin.query(`CREATE DATABASE "${name}" TEMPLATE "${TEMPLATE_DB}"`);
  } finally {
    await admin.end();
  }

  const database = new PostgresDatabase({ databaseUrl: withDb(name) });

  async function close() {
    await database.close();
    const cleanup = new pg.Client({
      connectionString: withDb("postgres"),
      connectionTimeoutMillis: 5000,
    });
    await cleanup.connect();
    try {
      await cleanup.query(`DROP DATABASE IF EXISTS "${name}"`);
    } finally {
      await cleanup.end();
    }
  }

  return { name, database, close };
}
