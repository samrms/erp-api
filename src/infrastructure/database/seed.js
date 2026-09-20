import { Config } from "../../config/Config.js";
import { PostgresDatabase } from "./PostgresDatabase.js";
import { Argon2PasswordHasher } from "../security/Argon2PasswordHasher.js";
import { DatabaseSeeder } from "./seeders/DatabaseSeeder.js";

const config = new Config();
const database = new PostgresDatabase(config);
const hasher = new Argon2PasswordHasher();

const seeder = new DatabaseSeeder(database, hasher);
await seeder.execute();
await database.close();
