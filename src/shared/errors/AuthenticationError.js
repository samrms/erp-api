import { AppError } from "./AppError.js";
export class AuthenticationError extends AppError {
  constructor(message, code = "AUTHENTICATION_ERROR") {
    super(message, 401, code);
  }
}
