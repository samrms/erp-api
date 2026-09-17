import { BaseService } from "../../../shared/http/BaseService.js";
import { AuthenticationError } from "../../../shared/errors/AuthenticationError.js";
export class AuthService extends BaseService {
  constructor(authRepository, passwordHasher, tokenProvider) {
    super();
    this.authRepository = authRepository;
    this.passwordHasher = passwordHasher;
    this.tokenProvider = tokenProvider;
  }

  async register({ email, password }) {
    const existing = await this.authRepository.findByEmail(email);
    if (existing) throw new AuthenticationError("Email already exists");
    const hash = await this.passwordHasher.hash(password);
    return this.authRepository.create(email, hash);
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
      email,
      roles: userRow.roles || [],
      permissions: userRow.permissions || [],
    });
    return { token, user: { id: userRow.id, email: userRow.email } };
  }
}
