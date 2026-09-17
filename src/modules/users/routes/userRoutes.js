import { Router } from "express";
export const userRoutes = (controller) => {
  const router = Router();
  router.get("/:id", controller.get);
  router.post("/", controller.create);
  return router;
};
