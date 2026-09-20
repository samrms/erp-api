import { BaseController } from "../../../shared/http/BaseController.js";

export class CustomerController extends BaseController {
  constructor(customerService) {
    super();
    this.customerService = customerService;
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async findAll(req, res, next) {
    try {
      return res.status(200).json(await this.customerService.findAll(req.query));
    } catch (e) {
      next(e);
    }
  }

  async findById(req, res, next) {
    try {
      return res.status(200).json(await this.customerService.findById(req.params.id));
    } catch (e) {
      next(e);
    }
  }

  async create(req, res, next) {
    try {
      return res.status(201).json(await this.customerService.create(req.body));
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      return res.status(200).json(await this.customerService.update(req.params.id, req.body));
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      await this.customerService.delete(req.params.id);
      return res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
