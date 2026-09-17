import { BaseService } from "../../../shared/http/BaseService.js";
export class UserService extends BaseService {
  constructor(userRepo) {
    super();
    this.repo = userRepo;
  }
  async get(id) {
    return this.repo.findById(id);
  }
  async create(data) {
    return this.repo.create(data);
  }
}
