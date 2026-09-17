exports.up = async (pgm) => {
  pgm.createTable('jobs', {
    id: { type: 'serial', primaryKey: true },
    job_type: { type: 'varchar(100)', notNull: true },
    payload: { type: 'jsonb', default: '{}' },
    status: { type: 'varchar(50)', notNull: true, default: 'pending' },
    attempts: { type: 'integer', notNull: true, default: 0 },
    error: { type: 'text' },
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
  pgm.dropTable('jobs')
}
