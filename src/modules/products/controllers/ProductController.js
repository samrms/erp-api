import { BaseController } from "../../../shared/http/BaseController.js";
import { CreateProductDto } from "../dto/CreateProductDto.js";
import { UpdateProductDto } from "../dto/UpdateProductDto.js";

export class ProductController extends BaseController {
  constructor(productRepository) {
    super();
    this.productRepository = productRepository;
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  async create(req, res, next) {
    try {
      return res
        .status(201)
        .json(
          await this.productRepository.create(new CreateProductDto(req.body)),
        );
    } catch (e) {
      next(e);
    }
  }

  async findAll(req, res, next) {
    try {
      return res
        .status(200)
        .json(await this.productRepository.findAll(req.query));
    } catch (e) {
      next(e);
    }
  }

  async findById(req, res, next) {
    try {
      const p = await this.productRepository.findById(req.params.id);
      if (!p) return res.status(404).json({ error: "Not found" });
      return res.status(200).json(p);
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const p = await this.productRepository.update(
        req.params.id,
        new UpdateProductDto(req.body),
      );
      return res.status(200).json(p);
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      await this.productRepository.delete(req.params.id);
      return res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
