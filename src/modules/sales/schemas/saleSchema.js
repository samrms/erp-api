export const saleSchema = {
  body: [
    { name: 'customerId', rules: 'required|integer' },
    { name: 'items', rules: 'required|array' },
  ],
};
