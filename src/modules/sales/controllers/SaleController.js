import { BaseController } from "../../../shared/http/BaseController.js";
import { CreateSaleDto } from "../dto/CreateSaleDto.js";

export class SaleController extends BaseController {
  constructor(saleService) {
    super();
    this.saleService = saleService;
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
    this.findById = this.findById.bind(this);
  }
  async create(req, res, next) {
    try {
      const s = await this.saleService.create(new CreateSaleDto(req.body));
      return res.status(201).json(s);
    } catch (e) {
      next(e);
    }
  }
  async findAll(req, res, next) {
    try {
      return res.status(200).json(await this.saleService.findAll(req.query));
    } catch (e) {
      next(e);
    }
  }
  async findById(req, res, next) {
    try {
      const s = await this.saleService.findById(req.params.id);
      if (!s) return res.status(404).json({ error: "Not found" });
      return res.status(200).json(s);
    } catch (e) {
      next(e);
    }
  }
}
