import assert from 'assert'
import { ApplicationContainer } from '../../src/app/container.js'

const container = new ApplicationContainer()
await container.start()

try {
  const res = await fetch(`http://localhost:${container.config.port}/health`)
  assert.strictEqual(res.status, 200)
  const body = await res.json()
  assert.strictEqual(body.status, 'ok')

  const ready = await fetch(`http://localhost:${container.config.port}/ready`)
  assert.strictEqual(ready.status, 200)

  console.log('E2E: Health/Ready OK')
} finally {
  await container.stop()
}
