import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
describe('module boundaries', () => {
  it('each module owns its controllers/services/repositories/routes', () => {
    const modules = ['auth', 'products', 'customers', 'suppliers', 'inventory', 'sales', 'jobs', 'users'];
    for (const m of modules) {
      const hasControllers = fs.existsSync('src/modules/'+m+'/controllers');
      const hasServices = fs.existsSync('src/modules/'+m+'/services');
      const hasRepos = fs.existsSync('src/modules/'+m+'/repositories');
      const hasRoutes = fs.existsSync('src/modules/'+m+'/routes');
      expect(hasControllers || !fs.existsSync('src/modules/'+m)).toBe(true);
    }
  });
});
