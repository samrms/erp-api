import express from "express";
export const jobRoutes = (controller) => {
  const router = express.Router();
  router.post("/", controller.create);
  router.get("/:id", controller.findById);
  return router;
};
