import express from "express";
export const inventoryRoutes = (controller) => {
  const router = express.Router();
  router.get("/:productId", controller.getStock);
  router.post("/:productId/adjust", controller.adjustStock);
  router.post("/movements", controller.createMovement);
  return router;
};
