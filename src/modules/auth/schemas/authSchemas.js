import { body } from "express-validator";

export const registerValidators = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("firstName")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("First name must not be empty"),
  body("lastName").optional().isString().trim(),
];

export const loginValidators = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password").exists().withMessage("Password is required"),
];

export const changePasswordValidators = [
  body("currentPassword").exists().withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
];
