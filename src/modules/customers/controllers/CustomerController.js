import { BaseController } from '../../../shared/http/BaseController.js'
export class CustomerController extends BaseController {
  constructor(service) {
    super()
    this.service = service
    this.findAll = this.findAll.bind(this)
    this.findById = this.findById.bind(this)
    this.create = this.create.bind(this)
    this.update = this.update.bind(this)
    this.delete = this.delete.bind(this)
  }
  async findAll(req, res, next) {
    try {
      return res.status(200).json(await this.service.findAll(req.query))
    } catch (e) {
      next(e)
    }
  }
  async findById(req, res, next) {
    try {
      const c = await this.service.findById(req.params.id)
      if (!c) return res.status(404).json({ error: 'Not found' })
      return res.status(200).json(c)
    } catch (e) {
      next(e)
    }
  }
  async create(req, res, next) {
    try {
      return res.status(201).json(await this.service.create(req.body))
    } catch (e) {
      next(e)
    }
  }
  async update(req, res, next) {
    try {
      return res
        .status(200)
        .json(await this.service.update(req.params.id, req.body))
    } catch (e) {
      next(e)
    }
  }
  async delete(req, res, next) {
    try {
      await this.service.delete(req.params.id)
      return res.status(204).send()
    } catch (e) {
      next(e)
    }
  }
}
