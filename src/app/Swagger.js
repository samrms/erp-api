import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from "express";
import { schemas } from "../infrastructure/http/swagger.schemas.js";
import { paths } from "../infrastructure/http/swagger.paths.js";

const definition = {
  openapi: "3.0.3",
  info: {
    title: "ERP REST API",
    version: "1.0.0",
    description:
      "Portfolio-grade modular monolith ERP REST API with authentication (Argon2 + JWT HS256), RBAC, " +
      "transactional sales with atomic inventory deduction, and asynchronous job processing via BullMQ.\n\n" +
      "## Authentication\n\n" +
      "1. Register via **POST /auth/register** or log in via **POST /auth/login** to obtain a JWT token.\n" +
      '2. Click the **Authorize** button above and enter the token (without "Bearer " prefix).\n' +
      "3. All protected endpoints require a valid JWT in the Authorization header.",
    contact: { name: "ERP API" },
    license: { name: "MIT" },
  },
  servers: [{ url: "/api/v1", description: "API v1" }],
  tags: [
    { name: "Health", description: "Liveness and readiness probes" },
    {
      name: "Auth",
      description: "User registration and JWT authentication (public)",
    },
    { name: "Products", description: "Product catalog CRUD" },
    { name: "Customers", description: "Customer management CRUD" },
    { name: "Suppliers", description: "Supplier management CRUD" },
    { name: "Inventory", description: "Stock levels and movements" },
    {
      name: "Sales",
      description: "Transactional sales with atomic inventory deduction",
    },
    {
      name: "Jobs",
      description: "Asynchronous background job submission (BullMQ)",
    },
  ],
  paths,
  components: {
    schemas,
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "HS256 JWT from POST /auth/login. Include the raw token value.",
      },
    },
  },
};

const options = {
  definition,
  apis: [], // Paths are fully centralized; no JSDoc scanning needed
};

const spec = swaggerJsdoc(options);

export const Swagger = () => {
  const router = express.Router();

  // Swagger UI
  router.use(
    "/",
    swaggerUi.serve,
    swaggerUi.setup(spec, {
      explorer: true,
      customSiteTitle: "ERP API Docs",
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: "none",
        filter: true,
      },
    }),
  );

  // Raw OpenAPI JSON
  router.get("/openapi.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, max-age=300");
    res.json(spec);
  });

  return router;
};
