/**
 * Centralized OpenAPI schema definitions.
 *
 * These schemas reflect the ACTUAL database schema, DTOs, and validation
 * rules as implemented in migrations, DTOs, and schemas directories.
 *
 * To document a new endpoint: add path definition to swagger.paths.js.
 * To add a new schema: add it here and reference it in paths.
 */

// ─── Reusable Fragments ───────────────────────────────────────────────

const Timestamp = {
  type: "string",
  format: "date-time",
  description: "ISO 8601 timestamp",
};

// ─── Domain Schemas ───────────────────────────────────────────────────

const User = {
  type: "object",
  description: "User account (password_hash never exposed)",
  properties: {
    id: { type: "integer", example: 1 },
    email: { type: "string", format: "email", example: "admin@erp.local" },
    created_at: { ...Timestamp, example: "2025-01-15T10:30:00.000Z" },
    updated_at: { ...Timestamp, example: "2025-01-15T10:30:00.000Z" },
  },
};

const Product = {
  type: "object",
  description: "Product catalog entry",
  properties: {
    id: { type: "integer", example: 1 },
    sku: { type: "string", minLength: 3, example: "WIDGET-001" },
    name: { type: "string", minLength: 1, example: "Widget A" },
    description: { type: "string", nullable: true, example: "A useful widget" },
    price: { type: "number", format: "decimal", minimum: 0, example: 29.99 },
    created_at: { ...Timestamp },
    updated_at: { ...Timestamp },
  },
};

const Customer = {
  type: "object",
  description: "Customer record",
  properties: {
    id: { type: "integer", example: 1 },
    name: { type: "string", minLength: 1, example: "Acme Corp" },
    email: {
      type: "string",
      format: "email",
      nullable: true,
      example: "acme@example.com",
    },
    phone: { type: "string", nullable: true, example: "+1-555-0100" },
    address: { type: "string", nullable: true, example: "123 Main St" },
    created_at: { ...Timestamp },
    updated_at: { ...Timestamp },
  },
};

const Supplier = {
  type: "object",
  description: "Supplier record",
  properties: {
    id: { type: "integer", example: 1 },
    name: { type: "string", minLength: 1, example: "Parts Unlimited" },
    email: {
      type: "string",
      format: "email",
      nullable: true,
      example: "sales@parts.example.com",
    },
    phone: { type: "string", nullable: true, example: "+1-555-0200" },
    created_at: { ...Timestamp },
    updated_at: { ...Timestamp },
  },
};

const Inventory = {
  type: "object",
  description: "Current stock level for a product (1:1 with products)",
  properties: {
    productId: { type: "integer", example: 1 },
    quantity: { type: "integer", minimum: 0, example: 150 },
  },
};

const InventoryMovement = {
  type: "object",
  description: "Immutable stock movement record",
  properties: {
    id: { type: "integer", example: 1 },
    productId: { type: "integer", example: 1 },
    quantity: {
      type: "integer",
      example: -10,
      description: "Negative for deductions, positive for additions",
    },
    movementType: {
      type: "string",
      example: "sale",
      description: "sale, adjustment, restock, etc.",
    },
    reason: { type: "string", nullable: true, example: "Sale item" },
    created_at: { ...Timestamp },
  },
};

const Sale = {
  type: "object",
  description: "Sale record with line items",
  properties: {
    id: { type: "integer", example: 1 },
    customer_id: { type: "integer", example: 1 },
    total_amount: { type: "number", format: "decimal", example: 59.98 },
    created_at: { ...Timestamp },
    items: {
      type: "array",
      description: "Line items (included when fetching by ID)",
      items: { $ref: "#/components/schemas/SaleItem" },
    },
  },
};

const SaleItem = {
  type: "object",
  description: "Individual line item in a sale",
  properties: {
    id: { type: "integer", example: 1 },
    sale_id: { type: "integer", example: 1 },
    product_id: { type: "integer", example: 1 },
    quantity: { type: "integer", minimum: 1, example: 2 },
    unit_price: { type: "number", format: "decimal", example: 29.99 },
    subtotal: { type: "number", format: "decimal", example: 59.98 },
  },
};

const Job = {
  type: "object",
  description: "Asynchronous background job",
  properties: {
    id: { type: "integer", example: 1 },
    job_type: { type: "string", example: "report_generation" },
    payload: { type: "object", nullable: true, example: { format: "pdf" } },
    status: {
      type: "string",
      enum: ["pending", "processing", "completed", "failed"],
      example: "pending",
    },
    attempts: { type: "integer", minimum: 0, example: 0 },
    error: { type: "string", nullable: true },
    created_at: { ...Timestamp },
    updated_at: { ...Timestamp },
  },
};

// ─── Auth Schemas ─────────────────────────────────────────────────────

const RegisterRequest = {
  type: "object",
  required: ["email", "password"],
  description: "Register a new user account",
  properties: {
    email: { type: "string", format: "email", example: "newuser@erp.local" },
    password: { type: "string", minLength: 6, example: "secret123" },
    roles: {
      type: "array",
      items: { type: "string" },
      default: [],
      description: "Optional role names to assign (must exist in roles table)",
      example: ["user"],
    },
  },
};

const LoginRequest = {
  type: "object",
  required: ["email", "password"],
  description: "Authenticate and receive a JWT",
  properties: {
    email: { type: "string", format: "email", example: "admin@erp.local" },
    password: { type: "string", example: "secret123" },
  },
};

const AuthResponse = {
  type: "object",
  description: "Successful authentication response",
  properties: {
    token: {
      type: "string",
      description: "HS256 JWT (no expiry documented in code)",
      example: "eyJhbGciOiJIUzI1NiIs...",
    },
    user: {
      type: "object",
      properties: {
        id: { type: "integer", example: 1 },
        email: { type: "string", format: "email", example: "admin@erp.local" },
      },
    },
  },
};

const RegisteredUser = {
  type: "object",
  description: "User record returned after registration (from RETURNING *)",
  properties: {
    id: { type: "integer", example: 2 },
    email: { type: "string", format: "email", example: "newuser@erp.local" },
    password_hash: {
      type: "string",
      description: "⚠ Exposed in current implementation (Argon2 hash)",
    },
    created_at: { ...Timestamp },
    updated_at: { ...Timestamp },
  },
};

// ─── Request Schemas ──────────────────────────────────────────────────

const CreateProductRequest = {
  type: "object",
  required: ["sku", "name", "price"],
  description: "Create a new product",
  properties: {
    sku: { type: "string", minLength: 3, example: "WIDGET-001" },
    name: { type: "string", minLength: 1, example: "Widget A" },
    description: { type: "string", example: "A useful widget" },
    price: { type: "number", minimum: 0, example: 29.99 },
  },
};

const UpdateProductRequest = {
  type: "object",
  description: "Update an existing product (all fields optional)",
  properties: {
    name: { type: "string", minLength: 1, example: "Widget B" },
    description: { type: "string", example: "Updated description" },
    price: { type: "number", minimum: 0, example: 34.99 },
  },
};

const CreateCustomerRequest = {
  type: "object",
  required: ["name"],
  description: "Create a new customer",
  properties: {
    name: { type: "string", minLength: 1, example: "Acme Corp" },
    email: { type: "string", format: "email", example: "acme@example.com" },
    phone: { type: "string", example: "+1-555-0100" },
    address: { type: "string", example: "123 Main St" },
  },
};

const UpdateCustomerRequest = {
  type: "object",
  description: "Update an existing customer (all fields optional)",
  properties: {
    name: { type: "string", minLength: 1 },
    email: { type: "string", format: "email" },
    phone: { type: "string" },
    address: { type: "string" },
  },
};

const CreateSupplierRequest = {
  type: "object",
  required: ["name"],
  description: "Create a new supplier",
  properties: {
    name: { type: "string", minLength: 1, example: "Parts Unlimited" },
    email: {
      type: "string",
      format: "email",
      example: "sales@parts.example.com",
    },
    phone: { type: "string", example: "+1-555-0200" },
  },
};

const UpdateSupplierRequest = {
  type: "object",
  description: "Update an existing supplier (all fields optional)",
  properties: {
    name: { type: "string", minLength: 1 },
    email: { type: "string", format: "email" },
    phone: { type: "string" },
  },
  CreateSaleRequest: {
    type: "object",
    properties: {
      customerId: { type: "integer" },
      items: {
        type: "array",
        items: {
          type: "object",
          properties: {
            productId: { type: "integer" },
            quantity: { type: "integer", minimum: 1 },
          },
          required: ["productId", "quantity"],
        },
      },
    },
    required: ["items"],
  },
};

const CreateSaleRequest = {
  type: "object",
  required: ["items"],
  description:
    "Create a sale. Atomic: stock is deducted only if all items are in stock. Transaction rolls back on failure.",
  properties: {
    customerId: {
      type: "integer",
      description: "ID of the customer placing the order",
      example: 1,
    },
    items: {
      type: "array",
      minItems: 1,
      description: "Line items (at least one required)",
      items: {
        type: "object",
        required: ["productId", "quantity"],
        properties: {
          productId: {
            type: "integer",
            description:
              "Must reference an existing product with sufficient stock",
            example: 1,
          },
          quantity: { type: "integer", minimum: 1, example: 2 },
        },
      },
    },
  },
};

const CreateMovementRequest = {
  type: "object",
  required: ["productId", "quantity"],
  description:
    "Record a stock movement (positive = restock, negative = deduction)",
  properties: {
    productId: { type: "integer", example: 1 },
    quantity: {
      type: "integer",
      example: 50,
      description: "Positive to add stock, negative to deduct",
    },
    movementType: { type: "string", example: "restock" },
    reason: { type: "string", example: "Supplier shipment received" },
  },
};

const AdjustStockRequest = {
  type: "object",
  required: ["quantity"],
  description: "Adjust stock for a product (relative change, not absolute set)",
  properties: {
    quantity: {
      type: "integer",
      example: -10,
      description: "Negative to deduct, positive to add",
    },
  },
};

const SubmitJobRequest = {
  type: "object",
  required: ["jobType"],
  description: "Submit a background job for asynchronous processing",
  properties: {
    jobType: { type: "string", example: "report_generation" },
    payload: {
      type: "object",
      example: { format: "pdf", dateRange: "2025-01" },
    },
  },
};

// ─── Error Schemas ────────────────────────────────────────────────────

const ErrorResponse = {
  type: "object",
  description: "Standard error envelope",
  required: ["error"],
  properties: {
    error: {
      type: "object",
      required: ["code", "message"],
      properties: {
        code: { type: "string", example: "NOT_FOUND" },
        message: { type: "string", example: "Product not found" },
        requestId: { type: "string", example: "req-abc123" },
        stack: {
          type: "string",
          description: "Only included in development mode",
        },
      },
    },
  },
};

const ValidationErrorResponse = {
  type: "object",
  description: "Validation error (from express-validator or custom validation)",
  properties: {
    error: {
      type: "object",
      properties: {
        code: { type: "string", example: "VALIDATION_ERROR" },
        message: { type: "string", example: "Validation failed" },
        requestId: { type: "string" },
      },
    },
  },
};

const NotFoundResponse = {
  type: "object",
  properties: {
    error: { type: "string", example: "Not found" },
  },
};

// ─── Health Schemas ───────────────────────────────────────────────────

const HealthResponse = {
  type: "object",
  properties: {
    status: { type: "string", example: "ok" },
  },
};

const ReadyResponse = {
  type: "object",
  properties: {
    ready: { type: "boolean", example: true },
  },
};

const NotReadyResponse = {
  type: "object",
  properties: {
    ready: { type: "boolean", example: false },
  },
};

// ─── Export ───────────────────────────────────────────────────────────

export const schemas = {
  // Domain
  User,
  Product,
  Customer,
  Supplier,
  Inventory,
  InventoryMovement,
  Sale,
  SaleItem,
  Job,

  // Auth
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  RegisteredUser,

  // Create/Update Requests
  CreateProductRequest,
  UpdateProductRequest,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CreateSupplierRequest,
  UpdateSupplierRequest,
  CreateSaleRequest,
  CreateMovementRequest,
  AdjustStockRequest,
  SubmitJobRequest,

  // Errors
  ErrorResponse,
  ValidationErrorResponse,
  NotFoundResponse,

  // Health
  HealthResponse,
  ReadyResponse,
  NotReadyResponse,
};
