import { AdminSeeder } from "./seeders/AdminSeeder.js";

export async function seedAdmin({ database, passwordHasher }) {
  const seeder = new AdminSeeder(database, passwordHasher);
  return seeder.execute();
}
