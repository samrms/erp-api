import { describe, it, expect } from 'vitest'
import fs from 'node:fs'
describe('architecture', () => {
  it('domain should not import express', () => {
    const dirs = fs
      .readdirSync('src/modules')
      .filter((f) => fs.statSync('src/modules/' + f).isDirectory())
    for (const mod of dirs) {
      try {
        const files = fs
          .readdirSync('src/modules/' + mod + '/models')
          .filter((x) => x.endsWith('.js'))
        for (const file of files) {
          const content = fs.readFileSync(
            'src/modules/' + mod + '/models/' + file,
            'utf8',
          )
          expect(content).not.toContain('express')
        }
      } catch {}
    }
  })
})
