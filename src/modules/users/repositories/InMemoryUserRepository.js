export class InMemoryUserRepository {
  constructor(store) {
    this.store = store;
  }

  async findAll({ limit = 20, offset = 0, search = "" } = {}) {
    let users = this.store.users;
    if (search) {
      const q = search.toLowerCase();
      users = users.filter((u) => u.email.toLowerCase().includes(q));
    }
    return users.slice(offset, offset + limit).map((u) => ({
      id: u.id,
      email: u.email,
      first_name: u.first_name,
      last_name: u.last_name,
      created_at: u.created_at,
      updated_at: u.updated_at,
      roles: this.store.userRoles
        .filter((ur) => ur.user_id === u.id)
        .map((ur) => this.store.roles.find((r) => r.id === ur.role_id))
        .filter(Boolean)
        .map((r) => r.name),
    }));
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
      roles: this.store.userRoles
        .filter((ur) => ur.user_id === user.id)
        .map((ur) => this.store.roles.find((r) => r.id === ur.role_id))
        .filter(Boolean)
        .map((r) => r.name),
    };
  }

  async findRoleByName(name) {
    return this.store.roles.find((r) => r.name === name) || null;
  }

  async assignRole(userId, roleId) {
    const existing = this.store.userRoles.find(
      (ur) => ur.user_id === userId && ur.role_id === roleId,
    );
    if (existing) return false;
    this.store.userRoles.push({ user_id: userId, role_id: roleId });
    return true;
  }
}
