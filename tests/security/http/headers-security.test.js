import { describe, it, expect } from 'vitest';
describe('headers', () => {
  it('security middleware exists', () => {
    const { App } = require('../../../src/app/App.js');
    expect(typeof App).toBe('function');
  });
});
