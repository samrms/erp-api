export const up = (pgm) => {
  pgm.createTable('products', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    sku: { type: 'varchar(50)', notNull: true, unique: true },
    name: { type: 'varchar(150)', notNull: true },
    description: { type: 'text' },
    price: { type: 'numeric(12,2)', notNull: true },
    cost: { type: 'numeric(12,2)', notNull: true, default: '0.00' },
    active: { type: 'boolean', notNull: true, default: true },
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

  pgm.createIndex('products', 'sku', { unique: true })
  pgm.createIndex('products', 'name')
}

export const down = (pgm) => {
  pgm.dropTable('products')
}
