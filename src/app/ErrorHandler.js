import { AppError } from "../shared/errors/AppError.js";

export class ErrorHandler {
  constructor(config) {
    this.isDevelopment = config?.isDevelopment ?? false;
    this.handle = this.handle.bind(this);
  }

  handle(err, req, res, _next) {
    if (err instanceof AppError) {
      const body = err.toJSON();
      body.error.requestId = req.id || "-";
      if (this.isDevelopment) body.error.stack = err.stack;

      if (!err.isOperational) {
        console.error(
          JSON.stringify({
            event: "error.programmer",
            status: err.statusCode,
            code: err.code,
            message: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method,
            requestId: req.id,
          }),
        );
      }

      return res.status(err.statusCode).json(body);
    }

    const status = err.statusCode || err.status || 500;
    console.error(
      JSON.stringify({
        event: "error.unexpected",
        status,
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        requestId: req.id,
      }),
    );

    const body = {
      error: {
        code: "INTERNAL_ERROR",
        message: this.isDevelopment ? err.message : "Internal server error",
        requestId: req.id || "-",
      },
    };
    if (this.isDevelopment) body.error.stack = err.stack;

    res.status(status).json(body);
  }
}
