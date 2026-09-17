import { Config } from "../config/Config.js";
import { PostgresDatabase } from "../infrastructure/database/PostgresDatabase.js";
import { TransactionManager } from "../infrastructure/database/TransactionManager.js";
import { Argon2PasswordHasher } from "../infrastructure/security/Argon2PasswordHasher.js";
import { JwtTokenProvider } from "../infrastructure/security/JwtTokenProvider.js";
import { PostgresAuthRepository } from "../modules/auth/repositories/PostgresAuthRepository.js";
import { AuthService } from "../modules/auth/services/AuthService.js";
import { AuthController } from "../modules/auth/controllers/AuthController.js";
import { PostgresProductRepository } from "../modules/products/repositories/PostgresProductRepository.js";
import { ProductService } from "../modules/products/services/ProductService.js";
import { ProductController } from "../modules/products/controllers/ProductController.js";
import { PostgresCustomerRepository } from "../modules/customers/repositories/PostgresCustomerRepository.js";
import { CustomerService } from "../modules/customers/services/CustomerService.js";
import { CustomerController } from "../modules/customers/controllers/CustomerController.js";
import { PostgresInventoryRepository } from "../modules/inventory/repositories/PostgresInventoryRepository.js";
import { InventoryService } from "../modules/inventory/services/InventoryService.js";
import { PostgresSaleRepository } from "../modules/sales/repositories/PostgresSaleRepository.js";
import { SaleService } from "../modules/sales/services/SaleService.js";
import { SaleController } from "../modules/sales/controllers/SaleController.js";
import { BullMQJobQueue } from "../infrastructure/queue/BullMQJobQueue.js";

import { PostgresJobRepository } from "../modules/jobs/repositories/PostgresJobRepository.js";
import { JobService } from "../modules/jobs/services/JobService.js";
import { JobController } from "../modules/jobs/controllers/JobController.js";
import { PostgresSupplierRepository } from "../modules/suppliers/repositories/PostgresSupplierRepository.js";
import { SupplierService } from "../modules/suppliers/services/SupplierService.js";
import { SupplierController } from "../modules/suppliers/controllers/SupplierController.js";
import { InventoryController } from "../modules/inventory/controllers/InventoryController.js";

export class ApplicationContainer {
  constructor() {
    this.config = new Config();
    this.database = new PostgresDatabase(this.config);
    this.transactionManager = new TransactionManager(this.database);
    this.passwordHasher = new Argon2PasswordHasher();
    this.tokenProvider = new JwtTokenProvider(this.config);
    this.authRepo = new PostgresAuthRepository(this.database);
    this.authService = new AuthService(
      this.authRepo,
      this.passwordHasher,
      this.tokenProvider,
    );
    this.authController = new AuthController(this.authService);
    this.productRepo = new PostgresProductRepository(this.database);
    this.productService = new ProductService(this.productRepo);
    this.productController = new ProductController(this.productService);
    this.customerRepo = new PostgresCustomerRepository(this.database);
    this.customerService = new CustomerService(this.customerRepo);
    this.customerController = new CustomerController(this.customerService);
    this.inventoryRepo = new PostgresInventoryRepository(this.database);
    this.inventoryService = new InventoryService(this.inventoryRepo);
    this.saleRepo = new PostgresSaleRepository(this.database);
    this.saleService = new SaleService(
      this.saleRepo,
      this.inventoryRepo,
      this.transactionManager,
      this.productRepo,
    );
    this.saleController = new SaleController(this.saleService);
    this.queue = new BullMQJobQueue(this.config);
    this.jobRepo = new PostgresJobRepository(this.database);
    this.jobService = new JobService(this.jobRepo, this.queue);
    this.jobController = new JobController(this.jobService);
    this.supplierRepo = new PostgresSupplierRepository(this.database);
    this.supplierService = new SupplierService(this.supplierRepo);
    this.supplierController = new SupplierController(this.supplierService);
    this.inventoryController = new InventoryController(this.inventoryService);
  }
}
