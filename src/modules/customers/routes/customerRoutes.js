import { Router } from "express";
import { validate } from "../../../shared/validation/validate.js";
import {
  listCustomersValidators,
  customerIdValidator,
  createCustomerValidators,
  updateCustomerValidators,
} from "../schemas/customerSchemas.js";

export default class CustomerRoutes {
  constructor(customerController) {
    this.customerController = customerController;
    this.router = Router();
    this.register();
  }

  register() {
    this.router.get(
      "/",
      listCustomersValidators,
      validate,
      this.customerController.findAll,
    );

    this.router.get(
      "/:id",
      customerIdValidator,
      validate,
      this.customerController.findById,
    );

    this.router.post(
      "/",
      createCustomerValidators,
      validate,
      this.customerController.create,
    );

    this.router.patch(
      "/:id",
      updateCustomerValidators,
      validate,
      this.customerController.update,
    );

    this.router.delete(
      "/:id",
      customerIdValidator,
      validate,
      this.customerController.delete,
    );
  }

  getRouter() {
    return this.router;
  }
}
