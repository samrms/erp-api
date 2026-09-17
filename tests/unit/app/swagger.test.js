import { describe, it, expect, beforeAll } from "vitest";
import { Swagger } from "../../../src/app/Swagger.js";

describe("Swagger/OpenAPI documentation", () => {
  let spec;

  beforeAll(() => {
    // The Swagger export is a factory function that creates a router.
    // We need to extract the spec from the module to test it directly.
    // Import the schemas and paths to verify them directly.
    const {
      schemas,
    } = require("../../../src/infrastructure/http/swagger.schemas.js");
    const {
      paths,
    } = require("../../../src/infrastructure/http/swagger.paths.js");
    spec = { schemas, paths };
  });

  it("Swagger is exported as a function", () => {
    expect(typeof Swagger).toBe("function");
  });

  describe("Schemas", () => {
    it("defines all domain schemas", () => {
      const required = [
        "User",
        "Product",
        "Customer",
        "Supplier",
        "Inventory",
        "InventoryMovement",
        "Sale",
        "SaleItem",
        "Job",
      ];
      for (const name of required) {
        expect(spec.schemas[name]).toBeDefined();
        expect(spec.schemas[name].type).toBe("object");
      }
    });

    it("defines all request schemas", () => {
      const required = [
        "RegisterRequest",
        "LoginRequest",
        "AuthResponse",
        "RegisteredUser",
        "CreateProductRequest",
        "UpdateProductRequest",
        "CreateCustomerRequest",
        "UpdateCustomerRequest",
        "CreateSupplierRequest",
        "UpdateSupplierRequest",
        "CreateSaleRequest",
        "CreateMovementRequest",
        "AdjustStockRequest",
        "SubmitJobRequest",
      ];
      for (const name of required) {
        expect(spec.schemas[name]).toBeDefined();
      }
    });

    it("defines error schemas", () => {
      expect(spec.schemas.ErrorResponse).toBeDefined();
      expect(spec.schemas.ErrorResponse.properties.error).toBeDefined();
      expect(spec.schemas.NotFoundResponse).toBeDefined();
    });

    it("defines health schemas", () => {
      expect(spec.schemas.HealthResponse).toBeDefined();
      expect(spec.schemas.ReadyResponse).toBeDefined();
    });

    it("RegisterRequest has required fields", () => {
      const schema = spec.schemas.RegisterRequest;
      expect(schema.required).toContain("email");
      expect(schema.required).toContain("password");
      expect(schema.properties.email.format).toBe("email");
      expect(schema.properties.password.minLength).toBe(6);
    });

    it("LoginRequest has required fields", () => {
      const schema = spec.schemas.LoginRequest;
      expect(schema.required).toContain("email");
      expect(schema.required).toContain("password");
    });

    it("AuthResponse has token and user", () => {
      const schema = spec.schemas.AuthResponse;
      expect(schema.properties.token).toBeDefined();
      expect(schema.properties.user).toBeDefined();
      expect(schema.properties.user.properties.id).toBeDefined();
      expect(schema.properties.user.properties.email).toBeDefined();
    });

    it("CreateProductRequest has required fields", () => {
      const schema = spec.schemas.CreateProductRequest;
      expect(schema.required).toContain("sku");
      expect(schema.required).toContain("name");
      expect(schema.required).toContain("price");
      expect(schema.properties.price.minimum).toBe(0);
    });

    it("CreateSaleRequest requires items array", () => {
      const schema = spec.schemas.CreateSaleRequest;
      expect(schema.required).toContain("items");
      expect(schema.properties.items.type).toBe("array");
      expect(schema.properties.items.minItems).toBe(1);
    });

    it("Product schema has correct fields from database", () => {
      const props = spec.schemas.Product.properties;
      expect(props.id).toBeDefined();
      expect(props.sku).toBeDefined();
      expect(props.name).toBeDefined();
      expect(props.description).toBeDefined();
      expect(props.price).toBeDefined();
      expect(props.created_at).toBeDefined();
      expect(props.updated_at).toBeDefined();
      // password_hash should NOT be exposed
      expect(props.password_hash).toBeUndefined();
    });

    it("ErrorResponse has code, message, requestId", () => {
      const errorProps = spec.schemas.ErrorResponse.properties.error.properties;
      expect(errorProps.code).toBeDefined();
      expect(errorProps.message).toBeDefined();
      expect(errorProps.requestId).toBeDefined();
    });

    it("Job schema has status enum", () => {
      const schema = spec.schemas.Job;
      expect(schema.properties.status.enum).toEqual([
        "pending",
        "processing",
        "completed",
        "failed",
      ]);
    });
  });

  describe("Paths", () => {
    it("documents all health endpoints", () => {
      expect(spec.paths["/health"]).toBeDefined();
      expect(spec.paths["/health"].get).toBeDefined();
      expect(spec.paths["/ready"]).toBeDefined();
      expect(spec.paths["/ready"].get).toBeDefined();
    });

    it("documents auth endpoints", () => {
      expect(spec.paths["/auth/register"]).toBeDefined();
      expect(spec.paths["/auth/register"].post).toBeDefined();
      expect(spec.paths["/auth/login"]).toBeDefined();
      expect(spec.paths["/auth/login"].post).toBeDefined();
    });

    it("documents product CRUD endpoints", () => {
      expect(spec.paths["/products"]).toBeDefined();
      expect(spec.paths["/products"].get).toBeDefined();
      expect(spec.paths["/products"].post).toBeDefined();
      expect(spec.paths["/products/{id}"]).toBeDefined();
      expect(spec.paths["/products/{id}"].get).toBeDefined();
      expect(spec.paths["/products/{id}"].patch).toBeDefined();
      expect(spec.paths["/products/{id}"].delete).toBeDefined();
    });

    it("documents customer CRUD endpoints", () => {
      expect(spec.paths["/customers"]).toBeDefined();
      expect(spec.paths["/customers"].get).toBeDefined();
      expect(spec.paths["/customers"].post).toBeDefined();
      expect(spec.paths["/customers/{id}"]).toBeDefined();
      expect(spec.paths["/customers/{id}"].get).toBeDefined();
      expect(spec.paths["/customers/{id}"].patch).toBeDefined();
      expect(spec.paths["/customers/{id}"].delete).toBeDefined();
    });

    it("documents supplier CRUD endpoints", () => {
      expect(spec.paths["/suppliers"]).toBeDefined();
      expect(spec.paths["/suppliers"].get).toBeDefined();
      expect(spec.paths["/suppliers"].post).toBeDefined();
      expect(spec.paths["/suppliers/{id}"]).toBeDefined();
      expect(spec.paths["/suppliers/{id}"].get).toBeDefined();
      expect(spec.paths["/suppliers/{id}"].patch).toBeDefined();
      expect(spec.paths["/suppliers/{id}"].delete).toBeDefined();
    });

    it("documents sales endpoints", () => {
      expect(spec.paths["/sales"]).toBeDefined();
      expect(spec.paths["/sales"].get).toBeDefined();
      expect(spec.paths["/sales"].post).toBeDefined();
      expect(spec.paths["/sales/{id}"]).toBeDefined();
      expect(spec.paths["/sales/{id}"].get).toBeDefined();
    });

    it("documents inventory endpoints", () => {
      expect(spec.paths["/inventory"]).toBeDefined();
      expect(spec.paths["/inventory"].get).toBeDefined();
      expect(spec.paths["/inventory"].post).toBeDefined();
      expect(spec.paths["/inventory/{id}"]).toBeDefined();
      expect(spec.paths["/inventory/{id}"].get).toBeDefined();
      expect(spec.paths["/inventory/{id}"].patch).toBeDefined();
    });

    it("documents jobs endpoints", () => {
      expect(spec.paths["/jobs"]).toBeDefined();
      expect(spec.paths["/jobs"].post).toBeDefined();
      expect(spec.paths["/jobs/{id}"]).toBeDefined();
      expect(spec.paths["/jobs/{id}"].get).toBeDefined();
    });

    it("job submit returns 202 (not 201)", () => {
      const jobPost = spec.paths["/jobs"].post;
      expect(jobPost.responses["202"]).toBeDefined();
      expect(jobPost.responses["201"]).toBeUndefined();
    });

    it("health endpoints are public (no auth)", () => {
      const healthGet = spec.paths["/health"].get;
      expect(healthGet.security).toEqual([]);
    });

    it("auth endpoints are public (no auth)", () => {
      expect(spec.paths["/auth/register"].post.security).toEqual([]);
      expect(spec.paths["/auth/login"].post.security).toEqual([]);
    });

    it("protected endpoints require bearerAuth", () => {
      const protectedPaths = [
        "/products",
        "/products/{id}",
        "/customers",
        "/customers/{id}",
        "/suppliers",
        "/suppliers/{id}",
        "/sales",
        "/sales/{id}",
        "/inventory",
        "/inventory/{id}",
        "/jobs",
        "/jobs/{id}",
      ];
      for (const path of protectedPaths) {
        for (const method of Object.keys(spec.paths[path])) {
          const sec = spec.paths[path][method].security;
          expect(sec).toBeDefined();
          expect(sec).toContainEqual({ bearerAuth: [] });
        }
      }
    });

    it("has operationId on every endpoint", () => {
      for (const [path, methods] of Object.entries(spec.paths)) {
        for (const [method, op] of Object.entries(methods)) {
          expect(
            op.operationId,
            `${method.toUpperCase()} ${path} missing operationId`,
          ).toBeDefined();
        }
      }
    });

    it("has tags on every endpoint", () => {
      for (const [path, methods] of Object.entries(spec.paths)) {
        for (const [method, op] of Object.entries(methods)) {
          expect(
            op.tags,
            `${method.toUpperCase()} ${path} missing tags`,
          ).toBeDefined();
          expect(
            op.tags.length,
            `${method.toUpperCase()} ${path} has empty tags`,
          ).toBeGreaterThan(0);
        }
      }
    });
  });
});
