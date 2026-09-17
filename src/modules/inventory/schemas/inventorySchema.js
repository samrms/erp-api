export const inventorySchema = {
  body: [
    { name: "productId", rules: "required|integer" },
    { name: "quantity", rules: "required|integer" },
  ],
};
