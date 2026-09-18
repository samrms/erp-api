import { body, param } from "express-validator";

export const jobIdValidator = [param("id").isInt({ min: 1 }).toInt()];

export const submitJobValidators = [
  body("jobType")
    .isString()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Job type is required"),
  body("payload").optional().isObject(),
];
