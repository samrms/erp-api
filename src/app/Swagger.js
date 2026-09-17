import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ERP API — Modular Monolith",
      version: "1.0.0",
      description:
        "Portfolio-grade ERP REST API with authentication, RBAC, transactional sales, inventory, and asynchronous job processing.",
      contact: { name: "ERP API", url: "https://github.com/erp-api" },
    },
    servers: [{ url: "/api/v1" }],
    tags: [
      { name: "Auth", description: "Authentication and JWT" },
      { name: "Users", description: "User management" },
      { name: "Customers", description: "Customers" },
      { name: "Products", description: "Products" },
      { name: "Suppliers", description: "Suppliers" },
      { name: "Inventory", description: "Inventory and movements" },
      { name: "Sales", description: "Transactional sales" },
      { name: "Jobs", description: "Asynchronous jobs (BullMQ)" },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/**/*.js"],
};

const spec = swaggerJsdoc(options);
export const Swagger = () => {
  const router = express.Router();
  router.use("/", swaggerUi.serve, swaggerUi.setup(spec));
  return router;
};
