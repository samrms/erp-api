export const schemas = {
  User: {
    type: "object",
    properties: {
      id: { type: "integer", example: 1 },
      email: { type: "string", format: "email", example: "user@example.com" },
      roles: { type: "array", items: { type: "string" }, example: ["user"] },
      permissions: {
        type: "array",
        items: { type: "string" },
        example: ["read"],
      },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
    },
  },
  Customer: {
    type: "object",
    properties: {
      id: { type: "integer" },
      name: { type: "string" },
      email: { type: "string", format: "email" },
      phone: { type: "string" },
      address: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
    },
    required: ["name", "email"],
  },
  Product: {
    type: "object",
    properties: {
      id: { type: "integer" },
      sku: { type: "string" },
      name: { type: "string" },
      description: { type: "string" },
      price: { type: "number", format: "decimal", minimum: 0 },
      createdAt: { type: "string", format: "date-time" },
    },
    required: ["name", "price"],
  },
  Supplier: {
    type: "object",
    properties: {
      id: { type: "integer" },
      name: { type: "string" },
      email: { type: "string", format: "email" },
      phone: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
    },
    required: ["name"],
  },
  InventoryMovement: {
    type: "object",
    properties: {
      id: { type: "integer" },
      productId: { type: "integer" },
      quantity: { type: "integer" },
      movementType: { type: "string" },
      reason: { type: "string" },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  Sale: {
    type: "object",
    properties: {
      id: { type: "integer" },
      customerId: { type: "integer" },
      totalAmount: { type: "number" },
      createdAt: { type: "string", format: "date-time" },
    },
  },
  SaleItem: {
    type: "object",
    properties: {
      id: { type: "integer" },
      saleId: { type: "integer" },
      productId: { type: "integer" },
      quantity: { type: "integer", minimum: 1 },
      unitPrice: { type: "number" },
      subtotal: { type: "number" },
    },
    required: ["productId", "quantity"],
  },
  Job: {
    type: "object",
    properties: {
      id: { type: "integer" },
      jobType: { type: "string" },
      payload: { type: "object" },
      status: {
        type: "string",
        enum: ["pending", "processing", "completed", "failed"],
      },
      createdAt: { type: "string", format: "date-time" },
    },
    required: ["jobType"],
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
  AuthResponse: {
    type: "object",
    properties: {
      id: { type: "integer" },
      email: { type: "string" },
      token: { type: "string" },
      roles: { type: "array", items: { type: "string" } },
    },
  },
  Error: {
    type: "object",
    properties: {
      message: { type: "string" },
      code: { type: "string" },
      statusCode: { type: "integer" },
    },
    required: ["message"],
  },
  ValidationError: {
    type: "object",
    properties: {
      message: { type: "string" },
      errors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            msg: { type: "string" },
            param: { type: "string" },
          },
        },
      },
    },
  },
  Pagination: {
    type: "object",
    properties: {
      page: { type: "integer", default: 1 },
      limit: { type: "integer", default: 10, maximum: 100 },
      total: { type: "integer" },
      data: { type: "array" },
    },
  },
};
