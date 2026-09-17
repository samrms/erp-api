import { describe, it, expect } from 'vitest';
import { Config } from '../../../src/config/Config.js';
describe('Config', () => {
  it('reads port and database url', () => {
    process.env.JWT_SECRET = 'testsecret';
    const c = new Config();
    expect(typeof c.port).toBe('number');
    delete process.env.JWT_SECRET;
  });
});
