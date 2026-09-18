exports.up = async (pgm) => {
  pgm.createTable("sale_items", {
    id: { type: "serial", primaryKey: true },
    sale_id: {
      type: "integer",
      references: "sales(id)",
      onDelete: "cascade",
      notNull: true,
    },
    product_id: {
      type: "integer",
      references: "products(id)",
      onDelete: "restrict",
      notNull: true,
    },
    quantity: { type: "integer", notNull: true },
    unit_price: { type: "numeric(12,2)", notNull: true },
    subtotal: { type: "numeric(12,2)", notNull: true },
  });
};
exports.down = async (pgm) => {
  pgm.dropTable("sale_items");
};
