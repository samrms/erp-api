import { Router } from "express";
export default class InventoryRoutes {
  constructor(inventoryController) {
    this.inventoryController = inventoryController;
    this.router = Router();
    this.register();
  }
  register() {
    this.router.get("/", this.inventoryController.findAll);
    this.router.get("/:id", this.inventoryController.findById);
    this.router.post("/", this.inventoryController.create);
    this.router.patch("/:id", this.inventoryController.update);
  }
  getRouter() { return this.router; }
}
