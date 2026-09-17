import { describe, it, expect } from 'vitest';
describe('auth repo', () => { it('parameterized', () => expect(typeof require('../../../src/modules/auth/repositories/PostgresAuthRepository.js').PostgresAuthRepository).toBe('function')); });
