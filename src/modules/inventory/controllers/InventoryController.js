import { BaseController } from "../../../shared/http/BaseController.js";
import { InventoryAdjustmentDto } from "../dto/InventoryAdjustmentDto.js";

export class InventoryController extends BaseController {
  constructor(inventoryService) {
    super();
    this.inventoryService = inventoryService;
    this.getStock = this.getStock.bind(this);
    this.adjustStock = this.adjustStock.bind(this);
    this.createMovement = this.createMovement.bind(this);
  }

  async getStock(req, res, next) {
    try {
      const quantity = await this.inventoryService.getStock(
        req.params.productId,
      );
      return res.status(200).json({
        productId: Number(req.params.productId),
        quantity,
      });
    } catch (e) {
      next(e);
    }
  }

  async adjustStock(req, res, next) {
    try {
      const dto = new InventoryAdjustmentDto({
        productId: req.params.productId,
        ...req.body,
      });
      const result = await this.inventoryService.adjustStock(
        dto.productId,
        dto.quantity,
      );
      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async createMovement(req, res, next) {
    try {
      const result = await this.inventoryService.createMovement(req.body);
      return res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }
}
