import { describe, it, expect } from "vitest";
import { BaseController } from "../../../src/shared/http/BaseController.js";
import { BaseService } from "../../../src/shared/http/BaseService.js";
import { BaseRepository } from "../../../src/shared/repositories/BaseRepository.js";
import { BaseMiddleware } from "../../../src/shared/middleware/BaseMiddleware.js";
import { BaseDomainModel } from "../../../src/shared/domain/BaseDomainModel.js";
import { BaseDatabase } from "../../../src/infrastructure/database/BaseDatabase.js";
import { BaseLogger } from "../../../src/infrastructure/logger/BaseLogger.js";
import { BaseJobQueue } from "../../../src/infrastructure/queue/BaseJobQueue.js";
import { BaseWorker } from "../../../src/infrastructure/queue/BaseWorker.js";
import { BasePasswordHasher } from "../../../src/infrastructure/security/BasePasswordHasher.js";
import { BaseTokenProvider } from "../../../src/infrastructure/security/BaseTokenProvider.js";
import { AuthController } from "../../../src/modules/auth/controllers/AuthController.js";
import { ProductController } from "../../../src/modules/products/controllers/ProductController.js";
import { CustomerController } from "../../../src/modules/customers/controllers/CustomerController.js";
import { SupplierController } from "../../../src/modules/suppliers/controllers/SupplierController.js";
import { InventoryController } from "../../../src/modules/inventory/controllers/InventoryController.js";
import { SaleController } from "../../../src/modules/sales/controllers/SaleController.js";
import { JobController } from "../../../src/modules/jobs/controllers/JobController.js";
import { AuthService } from "../../../src/modules/auth/services/AuthService.js";
import { SaleService } from "../../../src/modules/sales/services/SaleService.js";
import { InventoryService } from "../../../src/modules/inventory/services/InventoryService.js";
import { JobService } from "../../../src/modules/jobs/services/JobService.js";
import { AuthMiddleware } from "../../../src/modules/auth/middleware/AuthMiddleware.js";
import { RBACMiddleware } from "../../../src/modules/auth/middleware/RBACMiddleware.js";
import { PostgresAuthRepository } from "../../../src/modules/auth/repositories/PostgresAuthRepository.js";
import { PostgresProductRepository } from "../../../src/modules/products/repositories/PostgresProductRepository.js";
import { PostgresCustomerRepository } from "../../../src/modules/customers/repositories/PostgresCustomerRepository.js";
import { PostgresSupplierRepository } from "../../../src/modules/suppliers/repositories/PostgresSupplierRepository.js";
import { PostgresInventoryRepository } from "../../../src/modules/inventory/repositories/PostgresInventoryRepository.js";
import { PostgresSaleRepository } from "../../../src/modules/sales/repositories/PostgresSaleRepository.js";
import { PostgresJobRepository } from "../../../src/modules/jobs/repositories/PostgresJobRepository.js";
import { PostgresDatabase } from "../../../src/infrastructure/database/PostgresDatabase.js";
import { Logger } from "../../../src/infrastructure/logger/Logger.js";
import { BullMQJobQueue } from "../../../src/infrastructure/queue/BullMQJobQueue.js";
import { BullMQWorker } from "../../../src/infrastructure/queue/BullMQWorker.js";
import { Argon2PasswordHasher } from "../../../src/infrastructure/security/Argon2PasswordHasher.js";
import { JwtTokenProvider } from "../../../src/infrastructure/security/JwtTokenProvider.js";

const nothing = {};
const fakeDb = { query: async () => ({ rows: [] }) };

describe("layer inheritance", () => {
  it("every controller extends BaseController", () => {
    for (const controller of [
      new AuthController(nothing),
      new ProductController(nothing),
      new CustomerController(nothing),
      new SupplierController(nothing),
      new InventoryController(nothing),
      new SaleController(nothing),
      new JobController(nothing),
    ]) {
      expect(controller).toBeInstanceOf(BaseController);
    }
  });

  it("every service extends BaseService", () => {
    for (const service of [
      new AuthService(nothing, nothing, nothing, nothing),
      new SaleService(nothing, nothing, nothing, nothing),
      new InventoryService(nothing),
      new JobService(nothing, nothing),
    ]) {
      expect(service).toBeInstanceOf(BaseService);
    }
  });

  it("every repository extends BaseRepository", () => {
    for (const repo of [
      new PostgresAuthRepository(fakeDb),
      new PostgresProductRepository(fakeDb),
      new PostgresCustomerRepository(fakeDb),
      new PostgresSupplierRepository(fakeDb),
      new PostgresInventoryRepository(fakeDb),
      new PostgresSaleRepository(fakeDb),
      new PostgresJobRepository(fakeDb),
    ]) {
      expect(repo).toBeInstanceOf(BaseRepository);
    }
  });

  it("every middleware extends BaseMiddleware", () => {
    expect(new AuthMiddleware(nothing, nothing)).toBeInstanceOf(BaseMiddleware);
    expect(new RBACMiddleware()).toBeInstanceOf(BaseMiddleware);
  });

  it("infrastructure adapters extend their bases", async () => {
    const database = new PostgresDatabase({
      databaseUrl: "postgres://localhost:5432/x",
    });
    expect(database).toBeInstanceOf(BaseDatabase);
    expect(new Logger()).toBeInstanceOf(BaseLogger);
    const jobQueue = new BullMQJobQueue({ redisUrl: "redis://localhost:6379" });
    expect(jobQueue).toBeInstanceOf(BaseJobQueue);
    const worker = new BullMQWorker(
      { redisUrl: "redis://localhost:6379" },
      nothing,
    );
    expect(worker).toBeInstanceOf(BaseWorker);
    worker.worker.on("error", () => {});
    expect(new Argon2PasswordHasher()).toBeInstanceOf(BasePasswordHasher);
    expect(new JwtTokenProvider({})).toBeInstanceOf(BaseTokenProvider);
    await worker.stop().catch(() => {});
    await jobQueue.close().catch(() => {});
    await database.close();
  });

  it("BaseDomainModel assigns initial state and touches timestamps", () => {
    const model = new BaseDomainModel({ id: 1, name: "N" });
    expect(model.id).toBe(1);
    expect(model.name).toBe("N");
    model.touch();
    expect(model.updatedAt).toBeInstanceOf(Date);
  });
});
