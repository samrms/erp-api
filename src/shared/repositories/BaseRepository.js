export class BaseRepository {
  constructor() {}
  async findAll(_query_query) {
    throw new Error("findAll must be implemented");
  }
  async findById(_id_id) {
    throw new Error("findById must be implemented");
  }
  async create(_data_data) {
    throw new Error("create must be implemented");
  }
  async update(_id_id, _data_data) {
    throw new Error("update must be implemented");
  }
  async delete(_id_id) {
    throw new Error("delete must be implemented");
  }
}
