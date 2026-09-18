import { BaseController } from "../../../shared/http/BaseController.js";
import { CustomerDto } from "../dto/CustomerDto.js";

export class CustomerController extends BaseController {
  constructor(customerRepository) {
    super();
    this.customerRepository = customerRepository;
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
        .json(await this.customerRepository.findAll(req.query));
    } catch (e) {
      next(e);
    }
  }

  async findById(req, res, next) {
    try {
      const c = await this.customerRepository.findById(req.params.id);
      if (!c) return res.status(404).json({ error: "Not found" });
      return res.status(200).json(c);
    } catch (e) {
      next(e);
    }
  }

  async create(req, res, next) {
    try {
      return res
        .status(201)
        .json(await this.customerRepository.create(new CustomerDto(req.body)));
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      return res
        .status(200)
        .json(
          await this.customerRepository.update(
            req.params.id,
            new CustomerDto(req.body),
          ),
        );
    } catch (e) {
      next(e);
    }
  }

  async delete(req, res, next) {
    try {
      await this.customerRepository.delete(req.params.id);
      return res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}
