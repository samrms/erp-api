import { BaseController } from "../../../shared/http/BaseController.js";
export class UserController extends BaseController {
  constructor(userService) {
    super();
    this.userService = userService;
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
  }
  async get(req, res, next) {
    try {
      const user = await this.userService.get(req.params.id);
      return res.status(200).json(user);
    } catch (e) {
      return next(e);
    }
  }
  async create(req, res, next) {
    try {
      const user = await this.userService.create(req.body);
      return res.status(201).json(user);
    } catch (e) {
      return next(e);
    }
  }
}
