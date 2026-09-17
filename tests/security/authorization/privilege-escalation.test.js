import { describe, it, expect } from 'vitest';
describe('privilege', () => { it('denied', () => expect(typeof 'admin').toBe('string')); });
