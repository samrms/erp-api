export class CustomerController {
  constructor(service) {
    this.service = service
    this.create = this.create.bind(this)
    this.findById = this.findById.bind(this)
    this.findMany = this.findMany.bind(this)
    this.update = this.update.bind(this)
  }
  async create(req, res, next) {
    try {
      const c = await this.service.create(req.body)
      res.status(201).json({ data: c })
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
  async update(req, res, next) {
    try {
      res.json({ data: await this.service.update(req.params.id, req.body) })
    } catch (e) {
      next(e)
    }
  }
}
