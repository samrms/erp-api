import { BaseController } from "../../../shared/http/BaseController.js";
import { JobDto } from "../dto/JobDto.js";

export class JobController extends BaseController {
  constructor(service) {
    super();
    this.service = service;
    this.create = this.create.bind(this);
    this.findById = this.findById.bind(this);
  }
  async create(req, res, next) {
    try {
      const r = await this.service.submit(new JobDto(req.body));
      return res.status(202).json(r);
    } catch (e) {
      next(e);
    }
  }
  async findById(req, res, next) {
    try {
      const r = await this.service.findById(req.params.id);
      if (!r) return res.status(404).json({ error: "Not found" });
      return res.status(200).json(r);
    } catch (e) {
      next(e);
    }
  }
}
