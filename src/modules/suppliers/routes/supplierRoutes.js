import { Router } from "express";

export default class SupplierRoutes {
  constructor(supplierController) {
    this.supplierController = supplierController;
    this.router = Router();
    this.register();
  }

  register() {
    this.router.get("/", this.supplierController.findAll);
    this.router.get("/:id", this.supplierController.findById);
    this.router.post("/", this.supplierController.create);
    this.router.patch("/:id", this.supplierController.update);
    this.router.delete("/:id", this.supplierController.delete);
  }

  getRouter() {
    return this.router;
  }
}
