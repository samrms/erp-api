import { AppError } from './AppError.js'
export class ValidationError extends AppError {
  constructor(message, code = 'VALIDATION_ERROR') {
    super(message, 400, code)
  }
}
