exports.up = async (pgm) => {
  pgm.createTable("suppliers", {
    id: { type: "serial", primaryKey: true },
    name: { type: "varchar(255)", notNull: true },
    email: { type: "varchar(255)" },
    phone: { type: "varchar(50)" },
    created_at: {
      type: "timestamp",
      default: pgm.func("now()"),
      notNull: true,
    },
    updated_at: {
      type: "timestamp",
      default: pgm.func("now()"),
      notNull: true,
    },
  });
};
exports.down = async (pgm) => {
  pgm.dropTable("suppliers");
};
