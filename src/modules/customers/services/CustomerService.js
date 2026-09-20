import { BaseService } from "../../../shared/http/BaseService.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";
import { CustomerDto } from "../dto/CustomerDto.js";

export class CustomerService extends BaseService {
  constructor(customerRepo) {
    super();
    this.customerRepo = customerRepo;
  }

  async findAll(query) {
    return this.customerRepo.findAll(query);
  }

  async findById(id) {
    const customer = await this.customerRepo.findById(id);
    if (!customer) throw new NotFoundError("Customer", id);
    return customer;
  }

  async create(data) {
    return this.customerRepo.create(new CustomerDto(data));
  }

  async update(id, data) {
    const customer = await this.customerRepo.findById(id);
    if (!customer) throw new NotFoundError("Customer", id);
    return this.customerRepo.update(id, new CustomerDto(data));
  }

  async delete(id) {
    const customer = await this.customerRepo.findById(id);
    if (!customer) throw new NotFoundError("Customer", id);
    await this.customerRepo.delete(id);
  }
}
