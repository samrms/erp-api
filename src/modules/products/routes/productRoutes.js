import { Router } from "express";
export default class ProductRoutes {
  constructor(productController) {
    this.productController = productController;
    this.router = Router();
    this.register();
  }
  register() {
    this.router.get("/", this.productController.findAll);
    this.router.get("/:id", this.productController.findById);
    this.router.post("/", this.productController.create);
    this.router.patch("/:id", this.productController.update);
    this.router.delete("/:id", this.productController.delete);
  }
  getRouter() { return this.router; }
}
