import { AuthenticationError } from "../../../shared/errors/AuthenticationError.js";

import { BaseMiddleware } from "../../../shared/middleware/BaseMiddleware.js";
export class AuthMiddleware extends BaseMiddleware {
  constructor(tokenProvider, tokenStore) {
    super();
    this.tokenProvider = tokenProvider;
    this.tokenStore = tokenStore;
    this.handle = this.handle.bind(this);
  }

  async handle(req, res, next) {
    try {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.replace("Bearer ", "").trim();
      if (!token) throw new AuthenticationError("Missing token");

      if (this.tokenStore && (await this.tokenStore.has(token))) {
        throw new AuthenticationError("Token has been revoked");
      }

      let payload;
      try {
        payload = this.tokenProvider.verify(token);
      } catch {
        throw new AuthenticationError("Invalid token");
      }
      req.user = payload;
      req.token = token;
      next();
    } catch (error) {
      next(error);
    }
  }
}
