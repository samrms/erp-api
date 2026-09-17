import { BaseController } from "../../../shared/http/BaseController.js";
export class ProductController extends BaseController {
  constructor(productService) {
    super();
    this.productService = productService;
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }
  async create(req, res, next) {
    try {
      return res.status(201).json(await this.productService.create(req.body));
    } catch (e) {
      next(e);
    }
  }
  async findAll(req, res, next) {
    try {
      return res.status(200).json(await this.productService.findAll(req.query));
    } catch (e) {
      next(e);
    }
  }
  async findById(req, res, next) {
    try {
      const p = await this.productService.findById(req.params.id);
      if (!p) return res.status(404).json({ error: "Not found" });
      return res.status(200).json(p);
    } catch (e) {
      next(e);
    }
  }
  async update(req, res, next) {
    try {
      const p = await this.productService.update(req.params.id, req.body);
      return res.status(200).json(p);
    } catch (e) {
      next(e);
    }
  }
  async delete(req, res, next) {
    try {
      await this.productService.delete(req.params.id);
      return res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}

/**
 * @openapi
 * tags: [PRODUCTS]
 */
