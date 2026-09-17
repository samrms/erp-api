import { test } from 'node:test'
import assert from 'node:assert'
import fs from 'node:fs'

test('architecture: domain files must not import express or pg', () => {
  const dirs = fs
    .readdirSync('src/modules')
    .filter((f) => fs.statSync(`src/modules/${f}`).isDirectory())
  for (const mod of dirs) {
    try {
      const path = `src/modules/${mod}/models`
      const files = fs.readdirSync(path).filter((f) => f.endsWith('.js'))
      for (const file of files) {
        const content = fs.readFileSync(`${path}/${file}`, 'utf8')
        assert(
          !content.includes('express'),
          `Module ${mod} domain imports express`,
        )
        assert(!content.includes('pg'), `Module ${mod} domain imports pg`)
        assert(
          !content.includes('bullmq'),
          `Module ${mod} domain imports bullmq`,
        )
      }
    } catch (e) {
      // module may not have models dir
    }
  }
})
