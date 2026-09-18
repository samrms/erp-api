import { Config } from "../config/Config.js";
import { PostgresDatabase } from "../infrastructure/database/PostgresDatabase.js";
import { TransactionManager } from "../infrastructure/database/TransactionManager.js";
import { Argon2PasswordHasher } from "../infrastructure/security/Argon2PasswordHasher.js";
import { JwtTokenProvider } from "../infrastructure/security/JwtTokenProvider.js";
import { TokenStore } from "../infrastructure/security/TokenStore.js";
import { BullMQJobQueue } from "../infrastructure/queue/BullMQJobQueue.js";
import { RedisCache } from "../infrastructure/cache/RedisCache.js";

import { PostgresAuthRepository } from "../modules/auth/repositories/PostgresAuthRepository.js";
import { AuthService } from "../modules/auth/services/AuthService.js";
import { AuthController } from "../modules/auth/controllers/AuthController.js";
import { AuthMiddleware } from "../modules/auth/middleware/AuthMiddleware.js";

import { PostgresProductRepository } from "../modules/products/repositories/PostgresProductRepository.js";
import { ProductController } from "../modules/products/controllers/ProductController.js";

import { PostgresCustomerRepository } from "../modules/customers/repositories/PostgresCustomerRepository.js";
import { CustomerController } from "../modules/customers/controllers/CustomerController.js";

import { PostgresSupplierRepository } from "../modules/suppliers/repositories/PostgresSupplierRepository.js";
import { SupplierController } from "../modules/suppliers/controllers/SupplierController.js";

import { PostgresInventoryRepository } from "../modules/inventory/repositories/PostgresInventoryRepository.js";
import { InventoryService } from "../modules/inventory/services/InventoryService.js";
import { InventoryController } from "../modules/inventory/controllers/InventoryController.js";

import { PostgresSaleRepository } from "../modules/sales/repositories/PostgresSaleRepository.js";
import { SaleService } from "../modules/sales/services/SaleService.js";
import { SaleController } from "../modules/sales/controllers/SaleController.js";

import { PostgresJobRepository } from "../modules/jobs/repositories/PostgresJobRepository.js";
import { PostgresUserRepository } from "../modules/users/repositories/PostgresUserRepository.js";
import { UserService } from "../modules/users/services/UserService.js";
import { UserController } from "../modules/users/controllers/UserController.js";
import { JobService } from "../modules/jobs/services/JobService.js";
import { JobController } from "../modules/jobs/controllers/JobController.js";

export class ApplicationContainer {
  constructor() {
    this.config = new Config();
    this.database = new PostgresDatabase(this.config);
    this.transactionManager = new TransactionManager(this.database);
    this.passwordHasher = new Argon2PasswordHasher();
    this.tokenProvider = new JwtTokenProvider(this.config);
    this.tokenStore = new TokenStore();
    this.queue = new BullMQJobQueue(this.config);
    this.cache = new RedisCache(this.config);

    this.authRepo = new PostgresAuthRepository(this.database);
    this.authService = new AuthService(
      this.authRepo,
      this.passwordHasher,
      this.tokenProvider,
      this.tokenStore,
    );
    this.authController = new AuthController(this.authService);
    this.authMiddleware = new AuthMiddleware(
      this.tokenProvider,
      this.tokenStore,
    );

    this.productRepo = new PostgresProductRepository(this.database, this.cache);
    this.productController = new ProductController(this.productRepo);

    this.customerRepo = new PostgresCustomerRepository(this.database);
    this.customerController = new CustomerController(this.customerRepo);

    this.supplierRepo = new PostgresSupplierRepository(this.database);
    this.supplierController = new SupplierController(this.supplierRepo);

    this.inventoryRepo = new PostgresInventoryRepository(this.database);
    this.inventoryService = new InventoryService(this.inventoryRepo);
    this.inventoryController = new InventoryController(this.inventoryService);

    this.saleRepo = new PostgresSaleRepository(this.database);
    this.saleService = new SaleService(
      this.saleRepo,
      this.inventoryRepo,
      this.transactionManager,
      this.productRepo,
    );
    this.saleController = new SaleController(this.saleService);

    this.jobRepo = new PostgresJobRepository(this.database);
    this.jobService = new JobService(this.jobRepo, this.queue);
    this.jobController = new JobController(this.jobService);

    this.userRepo = new PostgresUserRepository(this.database);
    this.userService = new UserService(this.userRepo);
    this.userController = new UserController(this.userService);
  }

  async close() {
    await this.tokenStore.close();
    await this.cache.close();
  }
}
