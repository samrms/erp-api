import { body, param, query } from "express-validator";

export const listUsersValidators = [
  query("limit").optional().isInt({ min: 1, max: 100 }).toInt(),
  query("offset").optional().isInt({ min: 0 }).toInt(),
];

export const userIdValidator = [param("id").isInt({ min: 1 }).toInt()];

export const promoteValidators = [
  param("id").isInt({ min: 1 }).toInt(),
  body("role")
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Role is required"),
];
