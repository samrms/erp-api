import { Router } from "express";
import { validate } from "../../../shared/validation/validate.js";
import {
  listSuppliersValidators,
  supplierIdValidator,
  createSupplierValidators,
  updateSupplierValidators,
} from "../schemas/supplierSchemas.js";

export default class SupplierRoutes {
  constructor(supplierController) {
    this.supplierController = supplierController;
    this.router = Router();
    this.register();
  }

  register() {
    this.router.get(
      "/",
      listSuppliersValidators,
      validate,
      this.supplierController.findAll,
    );

    this.router.get(
      "/:id",
      supplierIdValidator,
      validate,
      this.supplierController.findById,
    );

    this.router.post(
      "/",
      createSupplierValidators,
      validate,
      this.supplierController.create,
    );

    this.router.patch(
      "/:id",
      updateSupplierValidators,
      validate,
      this.supplierController.update,
    );

    this.router.delete(
      "/:id",
      supplierIdValidator,
      validate,
      this.supplierController.delete,
    );
  }

  getRouter() {
    return this.router;
  }
}
