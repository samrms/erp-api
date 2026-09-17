export class InventoryController {
  constructor(service) {
    this.service = service
    this.adjust = this.adjust.bind(this)
  }
  async adjust(req, res, next) {
    try {
      const result = await this.service.adjust(
        req.body.productId || req.params.productId,
        req.body.quantity || 0,
        req.body.reason,
        req.body.referenceId,
      )
      res.json({ data: result })
    } catch (e) {
      next(e)
    }
  }
}
