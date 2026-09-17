import { Router } from "express";
export default class AuthRoutes {
  constructor(authController) {
    this.authController = authController;
    this.router = Router();
    this.register();
  }
  register() {
    this.router.post("/register", this.authController.register);
    this.router.post("/login", this.authController.login);
  }
  getRouter() { return this.router; }
}
