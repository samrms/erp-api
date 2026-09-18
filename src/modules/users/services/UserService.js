import { BaseService } from "../../../shared/http/BaseService.js";
import { ConflictError } from "../../../shared/errors/ConflictError.js";
import { NotFoundError } from "../../../shared/errors/NotFoundError.js";

export class UserService extends BaseService {
  constructor(userRepo) {
    super();
    this.userRepo = userRepo;
  }

  async findAll(query) {
    return this.userRepo.findAll(query);
  }

  async findById(id) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundError("User", id);
    return user;
  }

  async promote(userId, { role }) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError("User", userId);
    const roleRow = await this.userRepo.findRoleByName(role);
    if (!roleRow) throw new NotFoundError("Role", role);
    const assigned = await this.userRepo.assignRole(userId, roleRow.id);
    if (!assigned) throw new ConflictError(`User already has role ${role}`);
    return { id: Number(userId), role: roleRow.name };
  }
}
