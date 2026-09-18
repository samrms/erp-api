exports.up = async (pgm) => {
  pgm.createTable("sales", {
    id: { type: "serial", primaryKey: true },
    customer_id: {
      type: "integer",
      references: "customers(id)",
      onDelete: "restrict",
      notNull: true,
    },
    total_amount: { type: "numeric(12,2)", notNull: true, default: 0 },
    created_at: {
      type: "timestamp",
      default: pgm.func("now()"),
      notNull: true,
    },
  });
};
exports.down = async (pgm) => {
  pgm.dropTable("sales");
};
