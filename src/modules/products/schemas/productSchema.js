export const createProductSchema = {
  sku: { type: 'string', required: true, minLength: 1, maxLength: 50 },
  name: { type: 'string', required: true, minLength: 1, maxLength: 150 },
  description: { type: 'string', required: false },
  price: { type: 'number', required: true, min: 0 },
  cost: { type: 'number', required: true, min: 0 },
}

export const updateProductSchema = {
  name: { type: 'string', required: false, minLength: 1, maxLength: 150 },
  description: { type: 'string', required: false },
  price: { type: 'number', required: false, min: 0 },
  cost: { type: 'number', required: false, min: 0 },
  active: { type: 'boolean', required: false },
}
