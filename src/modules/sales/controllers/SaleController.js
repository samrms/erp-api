export class SaleController {
  constructor(s) {
    this.service = s
    this.createSale = this.createSale.bind(this)
    this.findById = this.findById.bind(this)
    this.findMany = this.findMany.bind(this)
  }
  async createSale(req, res, next) {
    try {
      const sale = await this.service.createSale(
        req.body.customerId,
        req.body.userId || req.user?.sub,
        req.body.items,
      )
      res.status(201).json({ data: sale })
    } catch (e) {
      next(e)
    }
  }
  async findById(req, res, next) {
    try {
      res.json({ data: await this.service.findById(req.params.id) })
    } catch (e) {
      next(e)
    }
  }
  async findMany(req, res, next) {
    try {
      res.json({ data: await this.service.findMany(req.query) })
    } catch (e) {
      next(e)
    }
  }
}
