import { Router } from "express";
import { validate } from "../../../shared/validation/validate.js";
import {
  listProductsValidators,
  productIdValidator,
  createProductValidators,
  updateProductValidators,
} from "../schemas/productSchemas.js";

export default class ProductRoutes {
  constructor(productController) {
    this.productController = productController;
    this.router = Router();
    this.register();
  }

  register() {
    this.router.get(
      "/",
      listProductsValidators,
      validate,
      this.productController.findAll,
    );

    this.router.get(
      "/:id",
      productIdValidator,
      validate,
      this.productController.findById,
    );

    this.router.post(
      "/",
      createProductValidators,
      validate,
      this.productController.create,
    );

    this.router.patch(
      "/:id",
      updateProductValidators,
      validate,
      this.productController.update,
    );

    this.router.delete(
      "/:id",
      productIdValidator,
      validate,
      this.productController.delete,
    );
  }

  getRouter() {
    return this.router;
  }
}
