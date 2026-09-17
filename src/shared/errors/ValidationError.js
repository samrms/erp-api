import { AppError } from './AppError.js'

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = []) {
    super(message, 'VALIDATION_ERROR', 422)
    this.details = details
  }
}
