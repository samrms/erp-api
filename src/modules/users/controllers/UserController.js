import { BaseController } from "../../../shared/http/BaseController.js";
import { UserDto } from "../dto/UserDto.js";
import { PromoteUserDto } from "../dto/PromoteUserDto.js";

export class UserController extends BaseController {
  constructor(userService) {
    super();
    this.userService = userService;
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.promote = this.promote.bind(this);
  }

  async findAll(req, res, next) {
    try {
      const users = await this.userService.findAll(req.query);
      return res.status(200).json(users.map((u) => new UserDto(u)));
    } catch (e) {
      next(e);
    }
  }

  async findById(req, res, next) {
    try {
      const user = await this.userService.findById(req.params.id);
      return res.status(200).json(new UserDto(user));
    } catch (e) {
      next(e);
    }
  }

  async promote(req, res, next) {
    try {
      const result = await this.userService.promote(
        req.params.id,
        new PromoteUserDto(req.body),
      );
      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
}
