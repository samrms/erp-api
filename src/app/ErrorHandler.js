export class ErrorHandler {
  constructor() {
    this.handle = this.handle.bind(this);
  }
  handle(err, req, res, _next_next) {
    const status = err.statusCode || 500;
    const response = {
      error: {
        code: err.code || "INTERNAL_ERROR",
        message: err.message || "Internal server error",
        requestId: req.id || "-",
      },
    };
    if (process.env.NODE_ENV === "development")
      response.error.stack = err.stack;
    console.error(
      JSON.stringify({
        event: "error",
        status,
        message: err.message,
        path: req.path,
        requestId: req.id,
      }),
    );
    res.status(status).json(response);
  }
}
