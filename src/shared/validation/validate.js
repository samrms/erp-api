import { validationResult } from "express-validator";
import { ValidationError } from "../errors/ValidationError.js";

export const validate = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const details = result.array().map((e) => ({
      field: e.path,
      message: e.msg,
    }));
    return next(new ValidationError("Validation failed", details));
  }
  next();
};
