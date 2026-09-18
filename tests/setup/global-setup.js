import pg from "pg";
import { runner } from "node-pg-migrate";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE_URL =
  process.env.TEST_DATABASE_URL ||
  "postgres://postgres:postgres@localhost:5432/erp_db_test";

export const TEMPLATE_DB =
  process.env.ERP_TEST_TEMPLATE || "erp_test_template";

function withDb(url, db) {
  const u = new URL(url);
  u.pathname = `/${db}`;
  return u.toString();
}

export default async function setup() {
  try {
    const probe = new pg.Client({
      connectionString: withDb(BASE_URL, "postgres"),
      connectionTimeoutMillis: 3000,
    });
    await probe.connect();
    await probe.end();
  } catch (err) {
    console.warn(
      `[global-setup] PostgreSQL unreachable, skipping template DB: ${err.message}`,
    );
    return undefined;
  }

  const admin = new pg.Client({
    connectionString: withDb(BASE_URL, "postgres"),
    connectionTimeoutMillis: 5000,
  });
  await admin.connect();
  try {
    await admin.query(`DROP DATABASE IF EXISTS "${TEMPLATE_DB}"`);
    await admin.query(`CREATE DATABASE "${TEMPLATE_DB}"`);
  } finally {
    await admin.end();
  }

  const root = path.dirname(
    path.dirname(path.dirname(fileURLToPath(import.meta.url))),
  );
  await runner({
    databaseUrl: withDb(BASE_URL, TEMPLATE_DB),
    dir: path.join(root, "migrations"),
    direction: "up",
    migrationsTable: "pgmigrations",
    verbose: false,
  });

  return async () => {
    const cleanup = new pg.Client({
      connectionString: withDb(BASE_URL, "postgres"),
      connectionTimeoutMillis: 5000,
    });
    await cleanup.connect();
    try {
      await cleanup.query(`DROP DATABASE IF EXISTS "${TEMPLATE_DB}"`);
    } finally {
      await cleanup.end();
    }
  };
}

export function baseUrl() {
  return BASE_URL;
}
