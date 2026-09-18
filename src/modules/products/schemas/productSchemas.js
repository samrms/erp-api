import { body, param, query } from "express-validator";

export const listProductsValidators = [
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("offset").optional().isInt({ min: 0 }).toInt(),
  query("sortField").optional().isIn(["id", "name", "price", "created_at"]),
  query("sortOrder").optional().isIn(["asc", "desc"]),
];

export const productIdValidator = [param("id").isInt({ min: 1 }).toInt()];

export const createProductValidators = [
  body("sku")
    .isString()
    .trim()
    .isLength({ min: 3 })
    .withMessage("SKU must be at least 3 characters"),
  body("name")
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Name is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a non-negative number"),
  body("description").optional().isString(),
];

export const updateProductValidators = [
  param("id").isInt({ min: 1 }).toInt(),
  body("name").optional().isString().trim().isLength({ min: 1 }),
  body("price").optional().isFloat({ min: 0 }),
  body("description").optional().isString(),
];
