import { BaseDomainModel } from "../../../../shared/domain/BaseDomainModel.js";
export class Job extends BaseDomainModel {
  constructor({ id, jobType, payload, status }) {
    super();
    this.id = id;
    this.jobType = jobType;
    this.payload = payload;
    this.status = status;
  }
}
