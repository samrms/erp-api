import { BaseController } from "../../../shared/http/BaseController.js";
export class AuthController extends BaseController {
  constructor(authService) {
    super();
    this.authService = authService;
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  async register(req, res, next) {
    try {
      const result = await this.authService.register(req.body);
      return res.status(201).json(result);
    } catch (e) {
      return next(e);
    }
  }

  async login(req, res, next) {
    try {
      const result = await this.authService.login(req.body);
      return res.status(200).json(result);
    } catch (e) {
      return next(e);
    }
  }
}
/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: User created
 */
