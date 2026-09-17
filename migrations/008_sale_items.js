export const up = (pgm) => {
  pgm.createTable('sale_items', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()'),
    },
    sale_id: {
      type: 'uuid',
      notNull: true,
      references: 'sales',
      onDelete: 'CASCADE',
    },
    product_id: {
      type: 'uuid',
      notNull: true,
      references: 'products',
      onDelete: 'RESTRICT',
    },
    quantity: { type: 'integer', notNull: true, check: 'quantity > 0' },
    unit_price: { type: 'numeric(12,2)', notNull: true },
    subtotal: { type: 'numeric(12,2)', notNull: true },
  })
  pgm.createIndex('sale_items', ['sale_id'])
}

export const down = (pgm) => {
  pgm.dropTable('sale_items')
}
