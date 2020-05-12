import path from 'path';
import { existsSync } from 'fs';

export const entry = {
  path(project: 'client' | 'server'): string {
    const firstVariant = path.join(__dirname, `../../../src/rainier-${project}/entry.tsx`);
    const secondVariant = path.join(__dirname, `../../../src/${project}/entry.tsx`);
    return existsSync(firstVariant) ? firstVariant : secondVariant;
  },

  client(): string {
    return this.path('client');
  },

  server(): string {
    return this.path('server');
  },
};
