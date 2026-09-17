import { describe, it, expect } from 'vitest';
import { userSchema } from '../../../src/modules/users/schemas/userSchema.js';
describe('user schema', () => {
  it('exists', () => { expect(typeof userSchema).toBe('object'); });
});
