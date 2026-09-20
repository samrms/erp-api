import { BaseService } from "../../../shared/http/BaseService.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { CreateProductDto } from "../dto/CreateProductDto.js";
import { UpdateProductDto } from "../dto/UpdateProductDto.js";

export class ProductService extends BaseService {
  constructor(productRepo) {
    super();
    this.productRepo = productRepo;
  }

  async findAll(query) {
    return this.productRepo.findAll(query);
  }

  async findById(id) {
    const product = await this.productRepo.findById(id);
    if (!product) throw new NotFoundError("Product", id);
    return product;
  }

  async create(data) {
    return this.productRepo.create(new CreateProductDto(data));
  }

  async update(id, data) {
    const product = await this.productRepo.findById(id);
    if (!product) throw new NotFoundError("Product", id);
    return this.productRepo.update(id, new UpdateProductDto(data));
  }

  async delete(id) {
    const product = await this.productRepo.findById(id);
    if (!product) throw new NotFoundError("Product", id);
    await this.productRepo.delete(id);
  }
}
