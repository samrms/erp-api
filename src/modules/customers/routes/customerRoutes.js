import { Router } from "express";
export default class CustomerRoutes {
  constructor(customerController) {
    this.customerController = customerController;
    this.router = Router();
    this.register();
  }
  register() {
    this.router.get("/", this.customerController.findAll);
    this.router.get("/:id", this.customerController.findById);
    this.router.post("/", this.customerController.create);
    this.router.patch("/:id", this.customerController.update);
    this.router.delete("/:id", this.customerController.delete);
  }
  getRouter() { return this.router; }
}
