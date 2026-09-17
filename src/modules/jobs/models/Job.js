import { BaseDomainModel } from "../../../../shared/domain/BaseDomainModel.js";
export class Job extends BaseDomainModel {
  constructor({ id, jobType, payload = {}, status = "pending", createdAt, updatedAt }) {
    super({ id, createdAt, updatedAt });
    this.jobType = jobType;
    this.payload = payload;
    this.status = status;
  }
  markAsProcessing() {
    this.status = "processing";
    this.touch();
  }
  markAsCompleted() {
    this.status = "completed";
    this.touch();
  }
  markAsFailed() {
    this.status = "failed";
    this.touch();
  }
  validate() {
    if (!this.jobType) throw new Error("Job type is required");
    if (!this.payload || typeof this.payload !== "object") throw new Error("Job payload must be an object");
    return true;
  }
  toJSON() {
    return { id: this.id, jobType: this.jobType, payload: this.payload, status: this.status, createdAt: this.createdAt, updatedAt: this.updatedAt };
  }
}
