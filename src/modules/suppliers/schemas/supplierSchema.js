export const supplierSchema = {
  name: { type: 'string', required: true, minLength: 1 },
  email: { type: 'string', required: false },
  phone: { type: 'string', required: false },
}
