import { body, param } from "express-validator";

export const stockValidators = [param("productId").isInt({ min: 1 }).toInt()];

export const adjustValidators = [
  param("productId").isInt({ min: 1 }).toInt(),
  body("quantity").isInt().withMessage("Quantity must be an integer"),
];

export const movementValidators = [
  body("productId").isInt({ min: 1 }).withMessage("Product ID is required"),
  body("quantity").isInt().withMessage("Quantity must be an integer"),
  body("movementType")
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Movement type is required"),
  body("reason").optional().isString(),
];
