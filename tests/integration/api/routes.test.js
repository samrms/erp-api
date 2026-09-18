import { describe, it, expect } from "vitest";
import AuthRoutes from "../../../src/modules/auth/routes/authRoutes.js";
import ProductRoutes from "../../../src/modules/products/routes/productRoutes.js";
import CustomerRoutes from "../../../src/modules/customers/routes/customerRoutes.js";
import SupplierRoutes from "../../../src/modules/suppliers/routes/supplierRoutes.js";
import InventoryRoutes from "../../../src/modules/inventory/routes/inventoryRoutes.js";
import SaleRoutes from "../../../src/modules/sales/routes/saleRoutes.js";
import JobRoutes from "../../../src/modules/jobs/routes/jobRoutes.js";
import UserRoutes from "../../../src/modules/users/routes/userRoutes.js";

const noop = () => {};
const stubController = new Proxy({}, { get: () => noop });
const passthrough = (req, res, next) => next();

function layerCounts(RoutesClass, ...args) {
  const router = new RoutesClass(...args).getRouter();
  const counts = new Map();
  for (const layer of router.stack) {
    if (!layer.route) continue;
    for (const method of Object.keys(layer.route.methods)) {
      const key = `${method.toUpperCase()} ${layer.route.path}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  return counts;
}

describe("route registration", () => {
  it("registers every endpoint exactly once (no dead duplicate layers)", () => {
    const routers = [
      ["auth", AuthRoutes, [stubController, passthrough]],
      ["products", ProductRoutes, [stubController]],
      ["customers", CustomerRoutes, [stubController]],
      ["suppliers", SupplierRoutes, [stubController]],
      ["inventory", InventoryRoutes, [stubController]],
      ["sales", SaleRoutes, [stubController]],
      ["jobs", JobRoutes, [stubController]],
      ["users", UserRoutes, [stubController, passthrough]],
    ];
    for (const [name, RoutesClass, args] of routers) {
      const counts = layerCounts(RoutesClass, ...args);
      expect(counts.size, `${name} exposes no endpoints`).toBeGreaterThan(0);
      for (const [key, count] of counts) {
        expect(count, `${name}: ${key} registered ${count}x`).toBe(1);
      }
    }
  });

  it("exposes the expected endpoint inventory", () => {
    const expectations = [
      [
        AuthRoutes,
        [stubController, passthrough],
        [
          "POST /register",
          "POST /login",
          "POST /logout",
          "POST /change-password",
        ],
      ],
      [
        ProductRoutes,
        [stubController],
        ["GET /", "GET /:id", "POST /", "PATCH /:id", "DELETE /:id"],
      ],
      [
        CustomerRoutes,
        [stubController],
        ["GET /", "GET /:id", "POST /", "PATCH /:id", "DELETE /:id"],
      ],
      [
        SupplierRoutes,
        [stubController],
        ["GET /", "GET /:id", "POST /", "PATCH /:id", "DELETE /:id"],
      ],
      [
        InventoryRoutes,
        [stubController],
        ["GET /:productId", "PATCH /:productId/adjust", "POST /movements"],
      ],
      [SaleRoutes, [stubController], ["GET /", "GET /:id", "POST /"]],
      [JobRoutes, [stubController], ["GET /:id", "POST /"]],
      [UserRoutes, [stubController, passthrough], ["GET /", "GET /:id", "POST /:id/promote"]],
    ];
    for (const [RoutesClass, args, expected] of expectations) {
      const counts = layerCounts(RoutesClass, ...args);
      expect([...counts.keys()].sort()).toEqual([...expected].sort());
    }
  });
});
