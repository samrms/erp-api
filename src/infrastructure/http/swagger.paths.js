const unauthorized = {
  401: {
    description: "Missing or invalid JWT token",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ErrorResponse" },
      },
    },
  },
};

const forbidden = {
  403: {
    description: "Insufficient permissions (RBAC check failed)",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ErrorResponse" },
      },
    },
  },
};

const notFound = {
  404: {
    description: "Resource not found",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/NotFoundResponse" },
      },
    },
  },
};

const serverError = {
  500: {
    description: "Internal server error",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ErrorResponse" },
      },
    },
  },
};

const authErrors = { ...unauthorized, ...forbidden, ...serverError };
const fullCrudErrors = {
  ...unauthorized,
  ...forbidden,
  ...notFound,
  ...serverError,
};

export const paths = {
  "/health": {
    get: {
      tags: ["Health"],
      summary: "Liveness probe",
      operationId: "getHealth",
      security: [],
      responses: {
        200: {
          description: "API is running",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/HealthResponse" },
            },
          },
        },
      },
    },
  },

  "/ready": {
    get: {
      tags: ["Health"],
      summary: "Readiness probe (checks database connectivity)",
      operationId: "getReady",
      security: [],
      responses: {
        200: {
          description: "Database connection healthy",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ReadyResponse" },
            },
          },
        },
        503: {
          description: "Database unreachable",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/NotReadyResponse" },
            },
          },
        },
      },
    },
  },

  "/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register a new user account",
      operationId: "register",
      security: [],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/RegisterRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "User created",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisteredUser" },
            },
          },
        },
        409: {
          description: "Email already registered",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        ...serverError,
      },
    },
  },

  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Authenticate and receive a JWT token",
      operationId: "login",
      security: [],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/LoginRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Authentication successful",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AuthResponse" },
            },
          },
        },
        401: {
          description: "Invalid credentials",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        ...serverError,
      },
    },
  },

  "/auth/logout": {
    post: {
      tags: ["Auth"],
      summary: "Logout (revoke current token)",
      operationId: "logout",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Logged out successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Logged out successfully",
                  },
                },
              },
            },
          },
        },
        ...unauthorized,
        ...serverError,
      },
    },
  },

  "/auth/change-password": {
    post: {
      tags: ["Auth"],
      summary: "Change password (requires current password)",
      operationId: "changePassword",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["currentPassword", "newPassword"],
              properties: {
                currentPassword: { type: "string", example: "oldpass123" },
                newPassword: {
                  type: "string",
                  minLength: 6,
                  example: "newpass123",
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Password changed successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Password changed successfully",
                  },
                },
              },
            },
          },
        },
        ...authErrors,
      },
    },
  },

  "/products": {
    get: {
      tags: ["Products"],
      summary: "List all products",
      description:
        "Returns a paginated list of products. Requires product:read permission.",
      operationId: "findAllProducts",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "page",
          in: "query",
          schema: { type: "integer", default: 1 },
          description: "Page number",
        },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 10, maximum: 100 },
          description: "Items per page",
        },
      ],
      responses: {
        200: {
          description: "List of products",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Product" },
              },
            },
          },
        },
        ...authErrors,
      },
    },
    post: {
      tags: ["Products"],
      summary: "Create a new product",
      description:
        "Requires product:read permission (RBAC applied at module level).",
      operationId: "createProduct",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateProductRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Product created",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Product" },
            },
          },
        },
        ...authErrors,
      },
    },
  },

  "/products/{id}": {
    get: {
      tags: ["Products"],
      summary: "Get a product by ID",
      operationId: "findProductById",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "Product ID",
        },
      ],
      responses: {
        200: {
          description: "Product found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Product" },
            },
          },
        },
        ...fullCrudErrors,
      },
    },
    patch: {
      tags: ["Products"],
      summary: "Update a product",
      operationId: "updateProduct",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "Product ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateProductRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Product updated",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Product" },
            },
          },
        },
        ...fullCrudErrors,
      },
    },
    delete: {
      tags: ["Products"],
      summary: "Delete a product",
      operationId: "deleteProduct",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "Product ID",
        },
      ],
      responses: {
        204: { description: "Product deleted (no content)" },
        ...fullCrudErrors,
      },
    },
  },

  "/customers": {
    get: {
      tags: ["Customers"],
      summary: "List all customers",
      description:
        "Returns a paginated list of customers. Requires customer:read permission.",
      operationId: "findAllCustomers",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 10, maximum: 100 },
        },
      ],
      responses: {
        200: {
          description: "List of customers",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Customer" },
              },
            },
          },
        },
        ...authErrors,
      },
    },
    post: {
      tags: ["Customers"],
      summary: "Create a new customer",
      operationId: "createCustomer",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateCustomerRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Customer created",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Customer" },
            },
          },
        },
        ...authErrors,
      },
    },
  },

  "/customers/{id}": {
    get: {
      tags: ["Customers"],
      summary: "Get a customer by ID",
      operationId: "findCustomerById",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      responses: {
        200: {
          description: "Customer found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Customer" },
            },
          },
        },
        ...fullCrudErrors,
      },
    },
    patch: {
      tags: ["Customers"],
      summary: "Update a customer",
      operationId: "updateCustomer",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateCustomerRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Customer updated",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Customer" },
            },
          },
        },
        ...fullCrudErrors,
      },
    },
    delete: {
      tags: ["Customers"],
      summary: "Delete a customer",
      operationId: "deleteCustomer",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      responses: {
        204: { description: "Customer deleted (no content)" },
        ...fullCrudErrors,
      },
    },
  },

  "/suppliers": {
    get: {
      tags: ["Suppliers"],
      summary: "List all suppliers",
      description:
        "Returns a paginated list of suppliers. Requires supplier:read permission.",
      operationId: "findAllSuppliers",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 10, maximum: 100 },
        },
      ],
      responses: {
        200: {
          description: "List of suppliers",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Supplier" },
              },
            },
          },
        },
        ...authErrors,
      },
    },
    post: {
      tags: ["Suppliers"],
      summary: "Create a new supplier",
      operationId: "createSupplier",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateSupplierRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Supplier created",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Supplier" },
            },
          },
        },
        ...authErrors,
      },
    },
  },

  "/suppliers/{id}": {
    get: {
      tags: ["Suppliers"],
      summary: "Get a supplier by ID",
      operationId: "findSupplierById",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      responses: {
        200: {
          description: "Supplier found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Supplier" },
            },
          },
        },
        ...fullCrudErrors,
      },
    },
    patch: {
      tags: ["Suppliers"],
      summary: "Update a supplier",
      operationId: "updateSupplier",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateSupplierRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Supplier updated",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Supplier" },
            },
          },
        },
        ...fullCrudErrors,
      },
    },
    delete: {
      tags: ["Suppliers"],
      summary: "Delete a supplier",
      operationId: "deleteSupplier",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      responses: {
        204: { description: "Supplier deleted (no content)" },
        ...fullCrudErrors,
      },
    },
  },

  "/sales": {
    get: {
      tags: ["Sales"],
      summary: "List all sales",
      description:
        "Returns a paginated list of sales. Requires sale:read permission.",
      operationId: "findAllSales",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 10, maximum: 100 },
        },
      ],
      responses: {
        200: {
          description: "List of sales",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/Sale" },
              },
            },
          },
        },
        ...authErrors,
      },
    },
    post: {
      tags: ["Sales"],
      summary: "Create a sale (atomic transaction)",
      description:
        "Creates a sale within a BEGIN/COMMIT/ROLLBACK transaction. " +
        "Validates stock availability for each item, deducts inventory, " +
        "records stock movements, and creates sale + line items atomically. " +
        "Rolls back entirely if any step fails (e.g. insufficient stock).",
      operationId: "createSale",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateSaleRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Sale created atomically",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Sale" },
            },
          },
        },
        409: {
          description:
            "Business rule violation (e.g. insufficient stock, product not found)",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        ...authErrors,
      },
    },
  },

  "/sales/{id}": {
    get: {
      tags: ["Sales"],
      summary: "Get a sale by ID (includes line items)",
      operationId: "findSaleById",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      responses: {
        200: {
          description: "Sale found with line items",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Sale" },
            },
          },
        },
        ...fullCrudErrors,
      },
    },
  },

  "/inventory/movements": {
    post: {
      tags: ["Inventory"],
      summary: "Record a stock movement",
      description: "Creates an immutable inventory movement record.",
      operationId: "createMovement",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateMovementRequest" },
          },
        },
      },
      responses: {
        201: {
          description: "Movement recorded",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/InventoryMovement" },
            },
          },
        },
        ...authErrors,
      },
    },
  },

  "/inventory/{productId}": {
    get: {
      tags: ["Inventory"],
      summary: "Get stock level for a product",
      operationId: "getStock",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "productId",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "Product ID",
        },
      ],
      responses: {
        200: {
          description: "Current stock level",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Inventory" },
            },
          },
        },
        ...fullCrudErrors,
      },
    },
  },

  "/inventory/{productId}/adjust": {
    patch: {
      tags: ["Inventory"],
      summary: "Adjust stock for a product",
      description:
        "Applies a relative quantity change (positive to add, negative to deduct).",
      operationId: "adjustStock",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "productId",
          in: "path",
          required: true,
          schema: { type: "integer" },
          description: "Product ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/AdjustStockRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Stock adjusted",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Inventory" },
            },
          },
        },
        ...authErrors,
      },
    },
  },

  "/jobs": {
    post: {
      tags: ["Jobs"],
      summary: "Submit a background job",
      description:
        "Enqueues a job for asynchronous processing by the worker process. " +
        "Returns 202 Accepted (not 201) because the job is not yet processed.",
      operationId: "submitJob",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/SubmitJobRequest" },
          },
        },
      },
      responses: {
        202: {
          description: "Job accepted for processing",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Job" },
            },
          },
        },
        ...authErrors,
      },
    },
  },

  "/users": {
    get: {
      tags: ["Users"],
      summary: "List all users (admin only)",
      operationId: "findAllUsers",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        {
          name: "limit",
          in: "query",
          schema: { type: "integer", default: 10, maximum: 100 },
        },
      ],
      responses: {
        200: {
          description: "List of users (password hashes never exposed)",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/User" },
              },
            },
          },
        },
        ...authErrors,
      },
    },
  },

  "/users/{id}": {
    get: {
      tags: ["Users"],
      summary: "Get a user by ID (admin only)",
      operationId: "findUserById",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      responses: {
        200: {
          description: "User found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/User" },
            },
          },
        },
        ...fullCrudErrors,
      },
    },
  },

  "/users/{id}/promote": {
    post: {
      tags: ["Users"],
      summary: "Assign a role to a user (admin only)",
      operationId: "promoteUser",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/PromoteRequest" },
          },
        },
      },
      responses: {
        200: {
          description: "Role assigned",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "integer", example: 2 },
                  role: { type: "string", example: "admin" },
                },
              },
            },
          },
        },
        409: {
          description: "User already has the role",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        ...fullCrudErrors,
      },
    },
  },

  "/jobs/{id}": {
    get: {
      tags: ["Jobs"],
      summary: "Get job status by ID",
      operationId: "findJobById",
      security: [{ bearerAuth: [] }],
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer" } },
      ],
      responses: {
        200: {
          description: "Job found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/Job" },
            },
          },
        },
        ...fullCrudErrors,
      },
    },
  },
};
