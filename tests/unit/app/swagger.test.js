import { describe, it, expect } from 'vitest';
describe('swagger', () => {
  it('Swagger exports', () => {
    expect(typeof require('../../../src/app/Swagger.js').Swagger).toBe('function');
  });
});
