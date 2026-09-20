import { BaseService } from "../../../shared/http/BaseService.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { SupplierDto } from "../dto/SupplierDto.js";

export class SupplierService extends BaseService {
  constructor(supplierRepo) {
    super();
    this.supplierRepo = supplierRepo;
  }

  async findAll(query) {
    return this.supplierRepo.findAll(query);
  }

  async findById(id) {
    const supplier = await this.supplierRepo.findById(id);
    if (!supplier) throw new NotFoundError("Supplier", id);
    return supplier;
  }

  async create(data) {
    return this.supplierRepo.create(new SupplierDto(data));
  }

  async update(id, data) {
    const supplier = await this.supplierRepo.findById(id);
    if (!supplier) throw new NotFoundError("Supplier", id);
    return this.supplierRepo.update(id, new SupplierDto(data));
  }

  async delete(id) {
    const supplier = await this.supplierRepo.findById(id);
    if (!supplier) throw new NotFoundError("Supplier", id);
    await this.supplierRepo.delete(id);
  }
}
