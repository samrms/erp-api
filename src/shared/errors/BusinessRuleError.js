import { AppError } from "./AppError.js";

export class BusinessRuleError extends AppError {
  constructor(message = "Business rule violation") {
    super(message, 422, "BUSINESS_RULE_VIOLATION");
  }
}
