import { BaseRepository } from "../../../shared/repositories/BaseRepository.js";
export class PostgresJobRepository extends BaseRepository {
  constructor(database) {
    super();
    this.database = database;
  }
  async create({ jobType, payload }) {
    const res = await this.database.query(
      "INSERT INTO jobs (job_type, payload, status) VALUES ($1, $2, $3) RETURNING *",
      [jobType, payload, "pending"],
    );
    return res.rows[0];
  }
  async findById(id) {
    const res = await this.database.query("SELECT * FROM jobs WHERE id = $1", [
      id,
    ]);
    return res.rows[0] || null;
  }
  async updateStatus(id, status, error = null) {
    await this.database.query(
      "UPDATE jobs SET status = $1, error = $2, updated_at = now() WHERE id = $3",
      [status, error, id],
    );
  }
}
