exports.up = async (pgm) => {
  pgm.createTable('users', {
    id: { type: 'serial', primaryKey: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password_hash: { type: 'varchar(255)', notNull: true },
    created_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
      notNull: true,
    },
    updated_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
      notNull: true,
    },
  })

  pgm.createTable('roles', {
    id: { type: 'serial', primaryKey: true },
    name: { type: 'varchar(100)', notNull: true, unique: true },
    created_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
      notNull: true,
    },
  })

  pgm.createTable('permissions', {
    id: { type: 'serial', primaryKey: true },
    code: { type: 'varchar(100)', notNull: true, unique: true },
    name: { type: 'varchar(255)', notNull: true },
    created_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
      notNull: true,
    },
  })

  pgm.createTable('user_roles', {
    user_id: {
      type: 'integer',
      references: 'users(id)',
      onDelete: 'CASCADE',
      notNull: true,
    },
    role_id: {
      type: 'integer',
      references: 'roles(id)',
      onDelete: 'CASCADE',
      notNull: true,
    },
    primaryKey: ['user_id', 'role_id'],
  })

  pgm.createTable('role_permissions', {
    role_id: {
      type: 'integer',
      references: 'roles(id)',
      onDelete: 'CASCADE',
      notNull: true,
    },
    permission_id: {
      type: 'integer',
      references: 'permissions(id)',
      onDelete: 'CASCADE',
      notNull: true,
    },
    primaryKey: ['role_id', 'permission_id'],
  })
}
exports.down = async (pgm) => {
  pgm.dropTable('role_permissions')
  pgm.dropTable('user_roles')
  pgm.dropTable('permissions')
  pgm.dropTable('roles')
  pgm.dropTable('users')
}
