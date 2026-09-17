export class SupplierController {
  constructor(s) {
    this.service = s
    this.create = this.create.bind(this)
    this.findById = this.findById.bind(this)
    this.findMany = this.findMany.bind(this)
  }
  async create(req, res, next) {
    try {
      res.status(201).json({ data: await this.service.create(req.body) })
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
