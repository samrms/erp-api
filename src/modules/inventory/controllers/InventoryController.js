export class InventoryController {
  constructor(s) {
    this.service = s
    this.adjust = this.adjust.bind(this)
  }
  async adjust(req, res, next) {
    try {
      const r = await this.service.adjust(
        req.body.productId || req.params.productId,
        req.body.quantity || 0,
        req.body.reason,
        req.body.referenceId,
      )
      res.json({ data: r })
    } catch (e) {
      next(e)
    }
  }
}
