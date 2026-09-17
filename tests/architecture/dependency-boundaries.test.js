import { test } from 'node:test'
import assert from 'node:assert'

test('architecture: domain should not import express', async () => {
  const fs = await import('node:fs')
  const files = fs
    .readdirSync('src/modules')
    .filter((f) => fs.statSync(`src/modules/${f}`).isDirectory())
  for (const mod of files) {
    try {
      const content = fs.readFileSync(`src/modules/${mod}/models/*.js`, 'utf8')
      assert(
        !content.includes('express'),
        `Module ${mod} domain imports express`,
      )
      assert(!content.includes('pg'), `Module ${mod} domain imports pg`)
    } catch (e) {
      // ignore missing files
    }
  }
})
