import assert from 'assert'
import { PostgresDatabase } from '../../src/infrastructure/database/PostgresDatabase.js'
import { Config } from '../../src/config/config.js'
import { PostgresProductRepository } from '../../src/modules/products/repositories/PostgresProductRepository.js'

const testConfig = new Config()
// Use test DB URL if set
const dbUrl = process.env.DATABASE_URL_TEST || testConfig.databaseUrl

const database = new PostgresDatabase({ ...testConfig, databaseUrl: dbUrl })
const repo = new PostgresProductRepository(database)

try {
  // Basic integration check
  const created = await repo.create({
    sku: 'INT-TEST-1',
    name: 'Integration',
    price: 99,
    cost: 10,
  })
  assert.strictEqual(created.sku, 'INT-TEST-1')

  const found = await repo.findById(created.id)
  assert.strictEqual(found.id, created.id)

  await repo.deactivate(created.id)

  console.log('Integration: PostgresProductRepository OK')
} finally {
  await database.close()
}
