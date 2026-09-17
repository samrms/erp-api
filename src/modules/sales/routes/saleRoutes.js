import { Router } from "express";
export default class SaleRoutes {
  constructor(saleController) {
    this.saleController = saleController;
    this.router = Router();
    this.register();
  }
  register() {
    this.router.get("/", this.saleController.findAll);
    this.router.get("/:id", this.saleController.findById);
    this.router.post("/", this.saleController.create);
  }
  getRouter() { return this.router; }
}
