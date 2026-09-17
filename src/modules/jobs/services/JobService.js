import { BaseService } from "../../../shared/http/BaseService.js";
export class JobService extends BaseService {
  constructor(repo, queue) {
    super();
    this.repo = repo;
    this.queue = queue;
  }
  async submit({ jobType, payload }) {
    const record = await this.repo.create({ jobType, payload });
    await this.queue.add(jobType, { jobId: record.id, ...payload });
    return record;
  }
  async findById(id) {
    return this.repo.findById(id);
  }
}
