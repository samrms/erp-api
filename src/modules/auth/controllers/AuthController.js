import { BaseController } from "../../../shared/http/BaseController.js";
import { LoginDto } from "../dto/LoginDto.js";
import { RegisterUserDto } from "../dto/RegisterUserDto.js";

export class AuthController extends BaseController {
  constructor(authService) {
    super();
    this.authService = authService;
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  async register(req, res, next) {
    try {
      const result = await this.authService.register(
        new RegisterUserDto(req.body),
      );
      return res.status(201).json(result);
    } catch (e) {
      return next(e);
    }
  }

  async login(req, res, next) {
    try {
      const result = await this.authService.login(new LoginDto(req.body));
      return res.status(200).json(result);
    } catch (e) {
      return next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const result = await this.authService.logout(req.token);
      return res.status(200).json(result);
    } catch (e) {
      return next(e);
    }
  }

  async changePassword(req, res, next) {
    try {
      const result = await this.authService.changePassword(
        req.user.userId,
        req.body,
      );
      return res.status(200).json(result);
    } catch (e) {
      return next(e);
    }
  }
}
