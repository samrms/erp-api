export class BaseRepository {
  constructor() {}
  async findAll(query) {
    throw new Error("findAll must be implemented");
  }
  async findById(id) {
    throw new Error("findById must be implemented");
  }
  async create(data) {
    throw new Error("create must be implemented");
  }
  async update(id, data) {
    throw new Error("update must be implemented");
  }
  async delete(id) {
    throw new Error("delete must be implemented");
  }
}
