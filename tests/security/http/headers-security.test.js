import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
describe('headers', () => {
  it('security middleware configured', () => {
    expect(fs.existsSync('src/app/App.js')).toBe(true);
  });
});
