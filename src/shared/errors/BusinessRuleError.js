import { AppError } from './AppError.js'

export class BusinessRuleError extends AppError {
  constructor(message = 'Business rule violated') {
    super(message, 'BUSINESS_RULE_ERROR', 422)
  }
}
