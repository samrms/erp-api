import { describe, it, expect } from "vitest";
import { paths } from "../../../src/infrastructure/http/swagger.paths.js";
import AuthRoutes from "../../../src/modules/auth/routes/authRoutes.js";
import ProductRoutes from "../../../src/modules/products/routes/productRoutes.js";
import CustomerRoutes from "../../../src/modules/customers/routes/customerRoutes.js";
import SupplierRoutes from "../../../src/modules/suppliers/routes/supplierRoutes.js";
import InventoryRoutes from "../../../src/modules/inventory/routes/inventoryRoutes.js";
import SaleRoutes from "../../../src/modules/sales/routes/saleRoutes.js";
import JobRoutes from "../../../src/modules/jobs/routes/jobRoutes.js";
import UserRoutes from "../../../src/modules/users/routes/userRoutes.js";

const noop = () => {};
const stub = new Proxy({}, { get: () => noop });
const passthrough = (req, res, next) => next();

const mounted = [
  ["/auth", new AuthRoutes(stub, passthrough)],
  ["/products", new ProductRoutes(stub)],
  ["/customers", new CustomerRoutes(stub)],
  ["suppliers", new SupplierRoutes(stub)],
  ["/inventory", new InventoryRoutes(stub)],
  ["/sales", new SaleRoutes(stub)],
  ["/jobs", new JobRoutes(stub)],
  ["/users", new UserRoutes(stub, passthrough)],
];

describe("swagger coverage", () => {
  it("documents every registered endpoint", () => {
    const missing = [];
    for (const [prefix, routes] of mounted) {
      const base = prefix.startsWith("/") ? prefix : `/${prefix}`;
      for (const layer of routes.getRouter().stack) {
        if (!layer.route) continue;
        for (const method of Object.keys(layer.route.methods)) {
          const routePath = layer.route.path.replace(
            /:([^/]+)/g,
            (_, name) => `{${name}}`,
          );
          const key = `${base}${routePath === "/" ? "" : routePath}`;
          const documented = paths[key] && paths[key][method];
          if (!documented) missing.push(`${method.toUpperCase()} ${key}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });
});
