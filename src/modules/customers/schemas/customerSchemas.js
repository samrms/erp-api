import { body, param, query } from "express-validator";

export const listCustomersValidators = [
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("offset").optional().isInt({ min: 0 }).toInt(),
];

export const customerIdValidator = [param("id").isInt({ min: 1 }).toInt()];

export const createCustomerValidators = [
  body("name")
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name is required"),
  body("email").optional().isEmail().normalizeEmail(),
  body("phone").optional().isString(),
  body("address").optional().isString(),
];

export const updateCustomerValidators = [
  param("id").isInt({ min: 1 }).toInt(),
  body("name").optional().isString().trim().isLength({ min: 1 }),
  body("email").optional().isEmail().normalizeEmail(),
  body("phone").optional().isString(),
  body("address").optional().isString(),
];
