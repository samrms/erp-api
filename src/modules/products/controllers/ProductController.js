import { SchemaValidator } from '../../../shared/validation/SchemaValidator.js'
import {
  createProductSchema,
  updateProductSchema,
} from '../schemas/productSchema.js'
import { CreateProductDto } from '../dto/CreateProductDto.js'
import { UpdateProductDto } from '../dto/UpdateProductDto.js'
import { link } from '../../../shared/pagination/Hateoas.js'

export class ProductController {
  constructor(productService) {
    this.productService = productService
    this.create = this.create.bind(this)
    this.findById = this.findById.bind(this)
    this.findMany = this.findMany.bind(this)
    this.update = this.update.bind(this)
    this.deactivate = this.deactivate.bind(this)
  }

  async create(req, res, next) {
    try {
      SchemaValidator.validate(createProductSchema, req.body)
      const dto = new CreateProductDto(req.body)
      const product = await this.productService.create(dto)
      res.status(201).json({
        data: {
          id: product.id,
          sku: product.sku,
          name: product.name,
          price: product.getPrice(),
          _links: {
            self: { href: `/api/v1/products/${product.id}` },
            update: { href: `/api/v1/products/${product.id}`, method: 'PATCH' },
          },
        },
      })
    } catch (e) {
      next(e)
    }
  }

  async findById(req, res, next) {
    try {
      const product = await this.productService.findById(req.params.id)
      res.json({
        data: {
          id: product.id,
          sku: product.sku,
          name: product.name,
          price: product.getPrice(),
          active: product.isActive(),
          _links: {
            self: { href: `/api/v1/products/${product.id}` },
            update: { href: `/api/v1/products/${product.id}`, method: 'PATCH' },
          },
        },
      })
    } catch (e) {
      next(e)
    }
  }

  async findMany(req, res, next) {
    try {
      const result = await this.productService.findMany({
        page: parseInt(req.query.page || '1', 10),
        limit: parseInt(req.query.limit || '20', 10),
      })
      res.json({
        data: result.data.map((p) => ({
          id: p.id,
          sku: p.sku,
          name: p.name,
          price: p.price,
          _links: { self: { href: `/api/v1/products/${p.id}` } },
        })),
        pagination: result.pagination,
      })
    } catch (e) {
      next(e)
    }
  }

  async update(req, res, next) {
    try {
      SchemaValidator.validate(updateProductSchema, req.body)
      const dto = new UpdateProductDto(req.body)
      const product = await this.productService.update(req.params.id, dto)
      res.json({
        data: {
          id: product.id,
          name: product.name,
          price: product.getPrice(),
          _links: { self: { href: `/api/v1/products/${product.id}` } },
        },
      })
    } catch (e) {
      next(e)
    }
  }

  async deactivate(req, res, next) {
    try {
      const product = await this.productService.deactivate(req.params.id)
      res.json({
        data: {
          id: product.id,
          active: product.isActive(),
          _links: { self: { href: `/api/v1/products/${product.id}` } },
        },
      })
    } catch (e) {
      next(e)
    }
  }
}
