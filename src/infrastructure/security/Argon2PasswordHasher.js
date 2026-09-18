import argon2 from "argon2";

import { BasePasswordHasher } from "./BasePasswordHasher.js";

export class Argon2PasswordHasher extends BasePasswordHasher {
  async hash(password) {
    return argon2.hash(password);
  }

  async verify(hash, password) {
    return argon2.verify(hash, password);
  }
}
