import { AppError } from './AppError.js'
export class AuthorizationError extends AppError {
  constructor(message, code = 'AUTHORIZATION_ERROR') {
    super(message, 403, code)
  }
}
