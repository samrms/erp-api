import { BaseController } from "../../../shared/http/BaseController.js";
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
      const s = await this.saleService.create(req.body);
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

/**
 * @openapi
 * tags: [SALES]
 */
/**
 * @openapi
 * /sales:
 *   post:
 *     tags: [Sales]
 *     summary: Create a transactional sale
 *     operationId: createSale
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSaleRequest'
 *     responses:
 *       201:
 *         description: Sale created atomically
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Sale'
 *       409:
 *         description: Insufficient stock
 *       422:
 *         description: Validation error
 */
