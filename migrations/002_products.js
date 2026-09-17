exports.up = async (pgm) => {
  pgm.createTable('products', {
    id: { type: 'serial', primaryKey: true },
    sku: { type: 'varchar(100)', notNull: true, unique: true },
    name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    price: { type: 'numeric(12,2)', notNull: true, default: 0 },
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
}
exports.down = async (pgm) => {
  pgm.dropTable('products')
}
