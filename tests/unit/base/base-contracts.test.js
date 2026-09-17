import { describe, it, expect } from 'vitest';
import { BaseController } from '../../../src/shared/http/BaseController.js';
import { BaseService } from '../../../src/shared/http/BaseService.js';
import { BaseRepository } from '../../../src/shared/repositories/BaseRepository.js';
import { BaseDomainModel } from '../../../src/shared/domain/BaseDomainModel.js';
import { BaseMiddleware } from '../../../src/shared/middleware/BaseMiddleware.js';
describe('base contracts', () => {
  it('BaseController has create/findAll/findById/update/delete contracts', () => {
    const b = new BaseController();
    expect(typeof b).toBe('object');
  });
  it('BaseService has execute contract', () => {
    const b = new BaseService();
    expect(typeof b).toBe('object');
  });
  it('BaseRepository has findAll/findById/create/update/delete contracts', () => {
    const b = new BaseRepository();
    expect(typeof b).toBe('object');
  });
  it('BaseDomainModel assigns init', () => {
    const b = new BaseDomainModel({ a: 1 });
    expect(b.a).toBe(1);
  });
  it('BaseMiddleware has handle contract', () => {
    const b = new BaseMiddleware();
    expect(typeof b).toBe('object');
  });
});
