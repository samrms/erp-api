export const productSchema = {
  body: [
    { name: "sku", rules: "required|string|min:3" },
    { name: "name", rules: "required|string|min:1" },
    { name: "price", rules: "required|numeric|min:0" },
  ],
};
