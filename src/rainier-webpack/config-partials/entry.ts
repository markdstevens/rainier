import path from 'path';
import { existsSync } from 'fs';

export const entry = {
  path(project: 'client' | 'server'): string {
    const firstVariant = path.join(__dirname, `../../rainier-${project}/entry.js`);
    const secondVariant = path.join(__dirname, `../../${project}/entry.js`);

    return existsSync(firstVariant) ? firstVariant : secondVariant;
  },

  client(): string {
    return this.path('client');
  },

  server(): string {
    return this.path('server');
  },
};
