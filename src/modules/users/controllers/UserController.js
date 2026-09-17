export class UserController {
  constructor(s) {
    this.service = s
    this.findMany = this.findMany.bind(this)
    this.findById = this.findById.bind(this)
    this.update = this.update.bind(this)
  }
  async findMany(req, res, next) {
    try {
      res.json({ data: await this.service.findMany() })
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
  async update(req, res, next) {
    try {
      res.json({ data: await this.service.update(req.params.id, req.body) })
    } catch (e) {
      next(e)
    }
  }
}
