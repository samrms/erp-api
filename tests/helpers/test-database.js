export function connectTestDB() { return process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/test'; }
