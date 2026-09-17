export const createAuthSchema = (validator) => ({
  body: [
    validator.body("email").isEmail().normalizeEmail(),
    validator.body("password").isLength({ min: 6 }),
  ],
});

export const loginAuthSchema = (validator) => ({
  body: [
    validator.body("email").isEmail().normalizeEmail(),
    validator.body("password").exists(),
  ],
});
