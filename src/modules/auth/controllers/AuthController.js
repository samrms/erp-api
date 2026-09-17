import { SchemaValidator } from '../../../shared/validation/SchemaValidator.js'
import { registerSchema, loginSchema } from '../schemas/authSchema.js'
import { RegisterUserDto } from '../dto/RegisterUserDto.js'
import { LoginDto } from '../dto/LoginDto.js'

export class AuthController {
  constructor(authService) {
    this.authService = authService
    this.register = this.register.bind(this)
    this.login = this.login.bind(this)
    this.me = this.me.bind(this)
  }

  async register(req, res, next) {
    try {
      SchemaValidator.validate(registerSchema, req.body)
      const dto = new RegisterUserDto(req.body)
      const result = await this.authService.register(dto)
      res.status(201).json({
        data: { user: result.user, token: result.token },
        _links: { self: { href: '/api/v1/auth/me' } },
      })
    } catch (e) {
      next(e)
    }
  }

  async login(req, res, next) {
    try {
      SchemaValidator.validate(loginSchema, req.body)
      const dto = new LoginDto(req.body)
      const result = await this.authService.login(dto)
      res.json({
        data: { user: result.user, token: result.token },
        _links: { self: { href: '/api/v1/auth/me' } },
      })
    } catch (e) {
      next(e)
    }
  }

  async me(req, res, next) {
    try {
      const user = await this.authService.me(req.user)
      res.json({
        data: user,
        _links: {
          self: { href: '/api/v1/auth/me' },
          update: { href: `/api/v1/users/${user.id}`, method: 'PATCH' },
        },
      })
    } catch (e) {
      next(e)
    }
  }
}
