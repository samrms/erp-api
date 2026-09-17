import { Router } from "express";
export default class JobRoutes {
  constructor(jobController) {
    this.jobController = jobController;
    this.router = Router();
    this.register();
  }
  register() {
    this.router.get("/", this.jobController.findAll);
    this.router.get("/:id", this.jobController.findById);
    this.router.post("/", this.jobController.create);
  }
  getRouter() {
    return this.router;
  }
}
