export class InMemoryAuthRepository {
  constructor(store) {
    this.store = store;
  }

  async findByEmail(email) {
    const user = this.store.users.find((u) => u.email === email);
    if (!user) return null;
    const roles = this.store.userRoles
      .filter((ur) => ur.user_id === user.id)
      .map((ur) => {
        const role = this.store.roles.find((r) => r.id === ur.role_id);
        return role ? role.name : null;
      })
      .filter(Boolean);
    const permissions = await this.getPermissions(user.id);
    return { ...user, roles, permissions };
  }

  async getPermissions(userId) {
    const roleIds = this.store.userRoles
      .filter((ur) => ur.user_id === userId)
      .map((ur) => ur.role_id);
    const permIds = this.store.rolePermissions
      .filter((rp) => roleIds.includes(rp.role_id))
      .map((rp) => rp.permission_id);
    return this.store.permissions
      .filter((p) => permIds.includes(p.id))
      .map((p) => p.code);
  }

  async findById(id) {
    const user = this.store.users.find((u) => u.id === id);
    if (!user) return null;
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async create({ email, passwordHash, firstName, lastName }) {
    const existing = this.store.users.find((u) => u.email === email);
    if (existing) {
      const err = new Error("duplicate key");
      err.code = "23505";
      throw err;
    }
    const id = this.store._uuid();
    const now = this.store._now();
    const user = {
      id,
      email,
      password_hash: passwordHash,
      first_name: firstName || "",
      last_name: lastName || null,
      created_at: now,
      updated_at: now,
    };
    this.store.users.push(user);
    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async updatePassword(userId, passwordHash) {
    const user = this.store.users.find((u) => u.id === userId);
    if (user) {
      user.password_hash = passwordHash;
      user.updated_at = this.store._now();
    }
  }
}
