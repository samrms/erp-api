exports.up = async (pgm) => {
  pgm.createTable("inventory", {
    id: { type: "serial", primaryKey: true },
    product_id: {
      type: "integer",
      references: "products(id)",
      onDelete: "restrict",
      notNull: true,
      unique: true,
    },
    quantity: { type: "integer", notNull: true, default: 0 },
    updated_at: {
      type: "timestamp",
      default: pgm.func("now()"),
      notNull: true,
    },
  });
};
exports.down = async (pgm) => {
  pgm.dropTable("inventory");
};
