import { Router } from "express";
import { validate } from "../../../shared/validation/validate.js";
import {
  listSalesValidators,
  saleIdValidator,
  createSaleValidators,
} from "../schemas/saleSchemas.js";

export default class SaleRoutes {
  constructor(saleController) {
    this.saleController = saleController;
    this.router = Router();
    this.register();
  }

  register() {
    this.router.get(
      "/",
      listSalesValidators,
      validate,
      this.saleController.findAll,
    );

    this.router.get(
      "/:id",
      saleIdValidator,
      validate,
      this.saleController.findById,
    );

    this.router.post(
      "/",
      createSaleValidators,
      validate,
      this.saleController.create,
    );
  }

  getRouter() {
    return this.router;
  }
}
