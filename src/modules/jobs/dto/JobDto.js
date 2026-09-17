export class JobDto {
  constructor({ jobType, payload }) {
    this.jobType = jobType;
    this.payload = payload || {};
  }
}
