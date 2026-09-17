export const up = (pgm) => {
  pgm.createType('movement_type', ['IN', 'OUT', 'ADJUSTMENT'])

  pgm.createTable('inventory_movements', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    product_id: {
      type: 'uuid',
      notNull: true,
      references: 'products',
      onDelete: 'RESTRICT',
    },
    type: { type: 'movement_type', notNull: true },
    quantity: { type: 'integer', notNull: true },
    reason: { type: 'varchar(255)' },
    reference_id: { type: 'uuid' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
  })

  pgm.createIndex('inventory_movements', 'product_id')
  pgm.createIndex('inventory_movements', ['product_id', 'created_at'])
}

export const down = (pgm) => {
  pgm.dropTable('inventory_movements')
  pgm.dropType('movement_type')
}
