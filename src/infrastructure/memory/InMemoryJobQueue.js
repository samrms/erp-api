export class InMemoryJobQueue {
  constructor() {
    this.jobs = [];
  }

  async add(type, payload) {
    const id = `stub-${this.jobs.length + 1}`;
    this.jobs.push({ type, payload });
    return { id };
  }

  async close() {}
}
