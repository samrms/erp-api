export const up = (pgm) => {
  pgm.createTable('inventory', {
    product_id: {
      type: 'uuid',
      primaryKey: true,
      references: 'products',
      onDelete: 'CASCADE',
    },
    quantity: {
      type: 'integer',
      notNull: true,
      default: 0,
      check: 'quantity >= 0',
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('now()'),
    },
  })
}

export const down = (pgm) => {
  pgm.dropTable('inventory')
}
