import { Router } from "express";
export default class UserRoutes {
  constructor(userController) {
    this.userController = userController;
    this.router = Router();
    this.register();
  }
  register() {
    this.router.get("/", this.userController.findAll);
    this.router.get("/:id", this.userController.findById);
    this.router.post("/", this.userController.create);
    this.router.patch("/:id", this.userController.update);
    this.router.delete("/:id", this.userController.delete);
  }
  getRouter() {
    return this.router;
  }
}
