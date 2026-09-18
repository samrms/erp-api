import { body, param, query } from "express-validator";

export const listSalesValidators = [
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("offset").optional().isInt({ min: 0 }).toInt(),
];

export const saleIdValidator = [param("id").isInt({ min: 1 }).toInt()];

export const createSaleValidators = [
  body("customerId").isInt({ min: 1 }).withMessage("Customer ID is required"),
  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required"),
  body("items.*.productId")
    .isInt({ min: 1 })
    .withMessage("Product ID is required"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
];
