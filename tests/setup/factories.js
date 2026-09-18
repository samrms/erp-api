export function createCounters() {
  let n = 0;
  return { next: () => ++n };
}

export async function createProduct(db, counters, overrides = {}) {
  const n = counters.next();
  const res = await db.query(
    "INSERT INTO products (sku, name, description, price) VALUES ($1, $2, $3, $4) RETURNING *",
    [
      overrides.sku ?? `SKU-${n}`,
      overrides.name ?? `Product ${n}`,
      overrides.description ?? null,
      overrides.price ?? "19.99",
    ],
  );
  return res.rows[0];
}

export async function setStock(db, productId, quantity) {
  await db.query(
    "INSERT INTO inventory (product_id, quantity) VALUES ($1, $2) ON CONFLICT (product_id) DO UPDATE SET quantity = $2",
    [productId, quantity],
  );
}

export async function createCustomer(db, counters, overrides = {}) {
  const n = counters.next();
  const res = await db.query(
    "INSERT INTO customers (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING *",
    [
      overrides.name ?? `Customer ${n}`,
      overrides.email ?? `customer-${n}@example.com`,
      overrides.phone ?? null,
      overrides.address ?? null,
    ],
  );
  return res.rows[0];
}

export async function createUser(db, counters, overrides = {}) {
  const n = counters.next();
  const res = await db.query(
    "INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name",
    [
      overrides.email ?? `user-${n}@example.com`,
      overrides.passwordHash ?? "argon2-test-hash",
      overrides.firstName ?? `First${n}`,
      overrides.lastName ?? `Last${n}`,
    ],
  );
  return res.rows[0];
}

export async function grantPermissions(db, userId, codes) {
  const roleRes = await db.query(
    "INSERT INTO roles (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id",
    [`test-role-${userId}`],
  );
  const roleId = roleRes.rows[0].id;
  for (const code of codes) {
    const permRes = await db.query(
      "INSERT INTO permissions (code, name) VALUES ($1, $2) ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name RETURNING id",
      [code, code],
    );
    await db.query(
      "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [roleId, permRes.rows[0].id],
    );
  }
  await db.query(
    "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
    [userId, roleId],
  );
}
