export class InMemoryJobRepository {
  constructor(store) {
    this.store = store;
  }

  async create({ jobType, payload }) {
    const id = this.store._uuid();
    const job = {
      id,
      job_type: jobType,
      payload: payload || {},
      status: "pending",
      attempts: 0,
      error: null,
      created_at: this.store._now(),
      updated_at: this.store._now(),
    };
    this.store.jobs.push(job);
    return job;
  }

  async findById(id) {
    return this.store.jobs.find((j) => j.id === id) || null;
  }

  async updateStatus(id, status, error = null) {
    const job = this.store.jobs.find((j) => j.id === id);
    if (job) {
      job.status = status;
      job.error = error;
      job.updated_at = this.store._now();
    }
  }
}
