import { AuthenticationError } from "../../../shared/errors/AuthenticationError.js";
import { BusinessRuleError } from "../../../shared/errors/BusinessRuleError.js";

import { BaseService } from "../../../shared/http/BaseService.js";
export class AuthService extends BaseService {
  constructor(authRepository, passwordHasher, tokenProvider, tokenStore) {
    super();
    this.authRepository = authRepository;
    this.passwordHasher = passwordHasher;
    this.tokenProvider = tokenProvider;
    this.tokenStore = tokenStore;
  }

  async register({ email, password, firstName, lastName, role }) {
    const existing = await this.authRepository.findByEmail(email);
    if (existing) throw new AuthenticationError("Email already exists");
    const hash = await this.passwordHasher.hash(password);
    try {
      return await this.authRepository.create({
        email,
        passwordHash: hash,
        firstName,
        lastName,
        role,
      });
    } catch (err) {
      if (err && err.code === "23505") {
        throw new AuthenticationError("Email already exists");
      }
      throw err;
    }
  }

  async login({ email, password }) {
    const userRow = await this.authRepository.findByEmail(email);
    if (!userRow) throw new AuthenticationError("Invalid credentials");
    const valid = await this.passwordHasher.verify(
      userRow.password_hash,
      password,
    );
    if (!valid) throw new AuthenticationError("Invalid credentials");
    const token = this.tokenProvider.sign({
      userId: userRow.id,
      email: userRow.email,
      roles: userRow.roles || [],
      permissions: userRow.permissions || [],
    });
    return {
      token,
      user: {
        id: userRow.id,
        email: userRow.email,
        firstName: userRow.first_name,
        lastName: userRow.last_name,
      },
    };
  }

  async logout(token) {
    const decoded = this.tokenProvider.verify(token);
    const ttl = decoded.exp
      ? decoded.exp - Math.floor(Date.now() / 1000)
      : 3600;
    if (ttl > 0 && this.tokenStore) {
      await this.tokenStore.add(token, ttl);
    }
    return { message: "Logged out successfully" };
  }

  async changePassword(userId, { currentPassword, newPassword }) {
    const user = await this.authRepository.findById(userId);
    if (!user) throw new AuthenticationError("User not found");

    const fullUser = await this.authRepository.findByEmail(user.email);
    if (!fullUser) throw new AuthenticationError("User not found");

    const valid = await this.passwordHasher.verify(
      fullUser.password_hash,
      currentPassword,
    );
    if (!valid) throw new AuthenticationError("Current password is incorrect");

    if (newPassword.length < 6) {
      throw new BusinessRuleError("New password must be at least 6 characters");
    }

    const hash = await this.passwordHasher.hash(newPassword);
    await this.authRepository.updatePassword(userId, hash);
    return { message: "Password changed successfully" };
  }
}
