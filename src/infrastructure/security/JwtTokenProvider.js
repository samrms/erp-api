import jwt from "jsonwebtoken";

import { BaseTokenProvider } from "./BaseTokenProvider.js";

export class JwtTokenProvider extends BaseTokenProvider {
  constructor(config) {
    super();
    this.config = config;
  }

  sign(payload) {
    return jwt.sign(payload, this.config.jwtSecret, {
      issuer: this.config.jwtIssuer,
      audience: this.config.jwtAudience,
      expiresIn: this.config.jwtExpiresIn,
      algorithm: "HS256",
    });
  }

  verify(token) {
    return jwt.verify(token, this.config.jwtSecret, {
      issuer: this.config.jwtIssuer,
      audience: this.config.jwtAudience,
      algorithms: ["HS256"],
    });
  }
}
