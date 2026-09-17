import { User } from '../models/User.js'
import { NotFoundError } from '../../../shared/errors/NotFoundError.js'
export class UserService {
  constructor(repo) {
    this.repo = repo
  }
  async findById(id) {
    const r = await this.repo.findById(id)
    if (!r) throw new NotFoundError()
    return new User(r)
  }
  async findMany() {
    return (await this.repo.findMany()).map((r) => new User(r))
  }
  async update(id, data) {
    const r = await this.repo.update(id, data)
    return new User(r)
  }
}
