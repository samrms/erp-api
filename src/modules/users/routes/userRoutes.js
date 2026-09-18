import { Router } from "express";
import { validate } from "../../../shared/validation/validate.js";
import {
  listUsersValidators,
  userIdValidator,
  promoteValidators,
} from "../schemas/userSchemas.js";

export default class UserRoutes {
  constructor(userController, writeGuard) {
    this.userController = userController;
    this.writeGuard = writeGuard;
    this.router = Router();
    this.register();
  }

  register() {
    this.router.get(
      "/",
      listUsersValidators,
      validate,
      this.userController.findAll,
    );

    this.router.get(
      "/:id",
      userIdValidator,
      validate,
      this.userController.findById,
    );

    this.router.post(
      "/:id/promote",
      this.writeGuard,
      promoteValidators,
      validate,
      this.userController.promote,
    );
  }

  getRouter() {
    return this.router;
  }
}
