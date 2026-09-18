import { App } from "../../src/app/App.js";
import { JwtTokenProvider } from "../../src/infrastructure/security/JwtTokenProvider.js";
import { TokenStore } from "../../src/infrastructure/security/TokenStore.js";
import { AuthMiddleware } from "../../src/modules/auth/middleware/AuthMiddleware.js";
import { PostgresAuthRepository } from "../../src/modules/auth/repositories/PostgresAuthRepository.js";
import { AuthService } from "../../src/modules/auth/services/AuthService.js";
import { AuthController } from "../../src/modules/auth/controllers/AuthController.js";
import { PostgresProductRepository } from "../../src/modules/products/repositories/PostgresProductRepository.js";
import { ProductController } from "../../src/modules/products/controllers/ProductController.js";
import { PostgresCustomerRepository } from "../../src/modules/customers/repositories/PostgresCustomerRepository.js";
import { CustomerController } from "../../src/modules/customers/controllers/CustomerController.js";
import { PostgresSupplierRepository } from "../../src/modules/suppliers/repositories/PostgresSupplierRepository.js";
import { SupplierController } from "../../src/modules/suppliers/controllers/SupplierController.js";
import { PostgresInventoryRepository } from "../../src/modules/inventory/repositories/PostgresInventoryRepository.js";
import { InventoryService } from "../../src/modules/inventory/services/InventoryService.js";
import { InventoryController } from "../../src/modules/inventory/controllers/InventoryController.js";
import { PostgresSaleRepository } from "../../src/modules/sales/repositories/PostgresSaleRepository.js";
import { SaleService } from "../../src/modules/sales/services/SaleService.js";
import { SaleController } from "../../src/modules/sales/controllers/SaleController.js";
import { PostgresJobRepository } from "../../src/modules/jobs/repositories/PostgresJobRepository.js";
import { PostgresUserRepository } from "../../src/modules/users/repositories/PostgresUserRepository.js";
import { UserService } from "../../src/modules/users/services/UserService.js";
import { UserController } from "../../src/modules/users/controllers/UserController.js";
import { JobService } from "../../src/modules/jobs/services/JobService.js";
import { JobController } from "../../src/modules/jobs/controllers/JobController.js";
import { TransactionManager } from "../../src/infrastructure/database/TransactionManager.js";
import { Argon2PasswordHasher } from "../../src/infrastructure/security/Argon2PasswordHasher.js";
import { createIsolatedDb } from "./db.js";

export function createStubQueue() {
  return {
    added: [],
    async add(type, payload) {
      const job = { id: `stub-${this.added.length + 1}` };
      this.added.push({ type, payload });
      return job;
    },
    async close() {},
  };
}

export async function startTestApi(label) {
  const { database, close: closeDb } = await createIsolatedDb(label);

  const testConfig = {
    databaseUrl: "",
    jwtSecret: process.env.JWT_SECRET,
    jwtIssuer: process.env.JWT_ISSUER,
    jwtAudience: process.env.JWT_AUDIENCE,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    redisUrl: process.env.REDIS_URL,
    allowedOrigin: "",
    isDevelopment: false,
    isTest: true,
  };

  const tokenProvider = new JwtTokenProvider(testConfig);
  const tokenStore = new TokenStore();
  const queue = createStubQueue();
  const passwordHasher = new Argon2PasswordHasher();
  const transactionManager = new TransactionManager(database);

  const authRepo = new PostgresAuthRepository(database);
  const authService = new AuthService(
    authRepo,
    passwordHasher,
    tokenProvider,
    tokenStore,
  );
  const productRepo = new PostgresProductRepository(database);
  const customerRepo = new PostgresCustomerRepository(database);
  const supplierRepo = new PostgresSupplierRepository(database);
  const inventoryRepo = new PostgresInventoryRepository(database);
  const inventoryService = new InventoryService(inventoryRepo);
  const saleRepo = new PostgresSaleRepository(database);
  const saleService = new SaleService(
    saleRepo,
    inventoryRepo,
    transactionManager,
    productRepo,
  );
  const jobRepo = new PostgresJobRepository(database);
  const jobService = new JobService(jobRepo, queue);
  const userRepo = new PostgresUserRepository(database);
  const userService = new UserService(userRepo);

  const container = {
    config: testConfig,
    database,
    tokenProvider,
    tokenStore,
    queue,
    authRepo,
    authService,
    authController: new AuthController(authService),
    authMiddleware: new AuthMiddleware(tokenProvider, tokenStore),
    productRepo,
    productController: new ProductController(productRepo),
    customerRepo,
    customerController: new CustomerController(customerRepo),
    supplierRepo,
    supplierController: new SupplierController(supplierRepo),
    inventoryRepo,
    inventoryService,
    inventoryController: new InventoryController(inventoryService),
    saleRepo,
    saleService,
    saleController: new SaleController(saleService),
    jobRepo,
    jobService,
    jobController: new JobController(jobService),
    userRepo,
    userService,
    userController: new UserController(userService),
  };

  const app = new App(container);
  const server = await new Promise((resolve, reject) => {
    const s = app.app.listen(0, "127.0.0.1", () => resolve(s));
    s.on("error", reject);
  });
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  return {
    baseUrl,
    db: database,
    queue,
    container,
    tokenProvider,
    tokenFor: (permissions = []) =>
      tokenProvider.sign({
        userId: 1,
        email: "tester@example.com",
        roles: [],
        permissions,
      }),
    async close() {
      await new Promise((resolve) => server.close(resolve));
      await tokenStore.close();
      await closeDb();
    },
  };
}

export async function apiFetch(baseUrl, method, path, { token, body } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  let payload;
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  const res = await fetch(baseUrl + path, {
    method,
    headers,
    body: payload,
  });
  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  return { status: res.status, headers: res.headers, body: json, text };
}
