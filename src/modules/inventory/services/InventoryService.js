import { BaseService } from "../../../shared/http/BaseService.js";
export class InventoryService extends BaseService {
  constructor(inventoryRepo) {
    super();
    this.repo = inventoryRepo;
  }
  async getStock(productId) {
    return this.repo.getStock(productId);
  }
  async adjustStock(productId, quantity) {
    return this.repo.setStock(productId, quantity);
  }
  async createMovement(data) {
    return this.repo.createMovement(data);
  }
}
