export const registerSchema = {
  email: { type: 'string', required: true, minLength: 5 },
  password: { type: 'string', required: true, minLength: 8 },
  role: {
    type: 'string',
    required: false,
    enum: ['admin', 'manager', 'employee'],
  },
}

export const loginSchema = {
  email: { type: 'string', required: true, minLength: 5 },
  password: { type: 'string', required: true, minLength: 1 },
}
