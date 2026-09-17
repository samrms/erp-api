export const up = (pgm) => {
  pgm.createTable('sales', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    customer_id: {
      type: 'uuid',
      notNull: true,
      references: 'customers',
      onDelete: 'RESTRICT',
    },
    user_id: { type: 'uuid', references: 'users', onDelete: 'SET NULL' },
    status: { type: 'varchar(20)', notNull: true, default: 'pending' },
    total: { type: 'numeric(12,2)', notNull: true, default: '0.00' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
  })
  pgm.createIndex('sales', 'customer_id')
  pgm.createIndex('sales', 'user_id')
}

export const down = (pgm) => {
  pgm.dropTable('sales')
}
