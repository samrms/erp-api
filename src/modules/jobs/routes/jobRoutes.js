import { Router } from "express";
import { validate } from "../../../shared/validation/validate.js";
import { jobIdValidator, submitJobValidators } from "../schemas/jobSchemas.js";

export default class JobRoutes {
  constructor(jobController) {
    this.jobController = jobController;
    this.router = Router();
    this.register();
  }

  register() {
    this.router.get(
      "/:id",
      jobIdValidator,
      validate,
      this.jobController.findById,
    );

    this.router.post(
      "/",
      submitJobValidators,
      validate,
      this.jobController.create,
    );
  }

  getRouter() {
    return this.router;
  }
}
