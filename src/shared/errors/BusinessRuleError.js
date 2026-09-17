import { AppError } from "./AppError.js";
export class BusinessRuleError extends AppError {
  constructor(message, code = "BUSINESS_RULE_VIOLATION") {
    super(message, 422, code);
  }
}
