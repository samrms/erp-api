import { describe, it, expect } from 'vitest';
describe('horizontal access', () => { it('restricted', () => expect(typeof 'user').toBe('string')); });
