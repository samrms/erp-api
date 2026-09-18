import { BaseService } from "../../../shared/http/BaseService.js";
export class InventoryService extends BaseService {
  constructor(inventoryRepo) {
    super();
    this.inventoryRepo = inventoryRepo;
  }

  async getStock(productId) {
    return this.inventoryRepo.getStock(productId);
  }

  async adjustStock(productId, delta) {
    const quantity = await this.inventoryRepo.adjustStock(productId, delta);
    return { productId, quantity };
  }

  async createMovement(data) {
    await this.inventoryRepo.createMovement(data);
    return data;
  }
}
