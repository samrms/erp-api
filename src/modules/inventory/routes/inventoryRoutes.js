import { Router } from "express";
import { validate } from "../../../shared/validation/validate.js";
import {
  stockValidators,
  adjustValidators,
  movementValidators,
} from "../schemas/inventorySchemas.js";

export default class InventoryRoutes {
  constructor(inventoryController) {
    this.inventoryController = inventoryController;
    this.router = Router();
    this.register();
  }

  register() {
    this.router.get(
      "/:productId",
      stockValidators,
      validate,
      this.inventoryController.getStock,
    );

    this.router.patch(
      "/:productId/adjust",
      adjustValidators,
      validate,
      this.inventoryController.adjustStock,
    );

    this.router.post(
      "/movements",
      movementValidators,
      validate,
      this.inventoryController.createMovement,
    );
  }

  getRouter() {
    return this.router;
  }
}
