import { BaseController } from "../../../shared/http/BaseController.js";
import { SupplierDto } from "../dto/SupplierDto.js";

export class SupplierController extends BaseController {
  constructor(supplierRepository) {
    super();
    this.supplierRepository = supplierRepository;
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
        .json(await this.supplierRepository.findAll(req.query));
    } catch (e) {
      next(e);
    }
  }

  async findById(req, res, next) {
    try {
      const s = await this.supplierRepository.findById(req.params.id);
      if (!s) return res.status(404).json({ error: "Not found" });
      return res.status(200).json(s);
    } catch (e) {
      next(e);
    }
  }

  async create(req, res, next) {
    try {
      return res
        .status(201)
        .json(await this.supplierRepository.create(new SupplierDto(req.body)));
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      return res
        .status(200)
        .json(
          await this.supplierRepository.update(
            req.params.id,
            new SupplierDto(req.body),
          ),
        );
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      await this.supplierRepository.delete(req.params.id);
      return res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
