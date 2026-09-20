import { BaseController } from "../../../shared/http/BaseController.js";

export class SupplierController extends BaseController {
  constructor(supplierService) {
    super();
    this.supplierService = supplierService;
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async findAll(req, res, next) {
    try {
      return res
        .status(200)
        .json(await this.supplierService.findAll(req.query));
    } catch (e) {
      next(e);
    }
  }

  async findById(req, res, next) {
    try {
      return res
        .status(200)
        .json(await this.supplierService.findById(req.params.id));
    } catch (e) {
      next(e);
    }
  }

  async create(req, res, next) {
    try {
      return res.status(201).json(await this.supplierService.create(req.body));
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      return res
        .status(200)
        .json(await this.supplierService.update(req.params.id, req.body));
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      await this.supplierService.delete(req.params.id);
      return res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
