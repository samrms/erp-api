export const userSchema = {
  email: { type: 'string', required: true },
  role: {
    type: 'string',
    required: false,
    enum: ['admin', 'manager', 'employee'],
  },
}
