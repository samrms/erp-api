import { Router } from "express";
import { validate } from "../../../shared/validation/validate.js";
import {
  registerValidators,
  loginValidators,
  changePasswordValidators,
} from "../schemas/authSchemas.js";

export default class AuthRoutes {
  constructor(authController, authMiddleware) {
    this.authController = authController;
    this.authMiddleware = authMiddleware;
    this.router = Router();
    this.register();
  }

  register() {
    this.router.post(
      "/register",
      registerValidators,
      validate,
      this.authController.register,
    );

    this.router.post(
      "/login",
      loginValidators,
      validate,
      this.authController.login,
    );

    this.router.post(
      "/logout",
      this.authMiddleware,
      this.authController.logout,
    );

    this.router.post(
      "/change-password",
      this.authMiddleware,
      changePasswordValidators,
      validate,
      this.authController.changePassword,
    );
  }

  getRouter() {
    return this.router;
  }
}
