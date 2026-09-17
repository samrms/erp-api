exports.up = async (pgm) => {
  pgm.createTable("inventory_movements", {
    id: { type: "serial", primaryKey: true },
    product_id: {
      type: "integer",
      references: "products(id)",
      onDelete: "restrict",
      notNull: true,
    },
    quantity: { type: "integer", notNull: true },
    movement_type: { type: "varchar(50)", notNull: true },
    reason: { type: "varchar(255)" },
    created_at: {
      type: "timestamp",
      default: pgm.func("now()"),
      notNull: true,
    },
  });
};
exports.down = async (pgm) => {
  pgm.dropTable("inventory_movements");
};
