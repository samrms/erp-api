import { BaseError } from './BaseError.js'
export class AppError extends BaseError {
  constructor(message, statusCode = 500, code = 'APP_ERROR') {
    super(message, statusCode, code)
  }
}
