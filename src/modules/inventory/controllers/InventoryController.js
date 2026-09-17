import { BaseController } from '../../../shared/http/BaseController.js'
export class InventoryController extends BaseController {
  constructor(service) {
    super()
    this.service = service
    this.getStock = this.getStock.bind(this)
    this.adjustStock = this.adjustStock.bind(this)
    this.createMovement = this.createMovement.bind(this)
  }
  async getStock(req, res, next) {
    try {
      return res
        .status(200)
        .json({
          productId: req.params.productId,
          quantity: await this.service.getStock(req.params.productId),
        })
    } catch (e) {
      next(e)
    }
  }
  async adjustStock(req, res, next) {
    try {
      return res
        .status(200)
        .json(
          await this.service.adjustStock(
            req.params.productId,
            req.body.quantity,
          ),
        )
    } catch (e) {
      next(e)
    }
  }
  async createMovement(req, res, next) {
    try {
      return res.status(201).json(await this.service.createMovement(req.body))
    } catch (e) {
      next(e)
    }
  }
}
