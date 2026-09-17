import express from "express";
export const supplierRoutes = (controller) => {
  const router = express.Router();
  router.get("/", controller.findAll);
  router.get("/:id", controller.findById);
  router.post("/", controller.create);
  router.patch("/:id", controller.update);
  router.delete("/:id", controller.delete);
  return router;
};
