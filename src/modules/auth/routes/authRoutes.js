import express from "express";
export const authRoutes = (controller, _authMiddleware_authMiddleware) => {
  const router = express.Router();
  router.post("/register", controller.register);
  router.post("/login", controller.login);
  return router;
};
