import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
describe('no circular dependencies', () => {
  it('shared does not depend on modules', () => {
    const content = fs.readFileSync('src/shared/http/BaseController.js', 'utf8');
    expect(content).not.toContain('modules/');
  });
});
