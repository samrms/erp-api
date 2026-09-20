export class BaseSeeder {
  constructor(database) {
    this.database = database;
  }

  async execute() {
    throw new Error("execute must be implemented");
  }
}
