import { AppError } from "./AppError.js";

export class NotFoundError extends AppError {
  constructor(resource = "Resource", id) {
    const msg = id ? `${resource} ${id} not found` : `${resource} not found`;
    super(msg, 404, "NOT_FOUND");
  }
}
