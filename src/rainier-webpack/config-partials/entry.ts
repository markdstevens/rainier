import path from 'path';

export const entry = {
  path(project: 'client' | 'server'): string {
    return path.join(__dirname, `../../../dist/rainier-${project}/entry`);
  },

  client(): string {
    return this.path('client');
  },

  server(): string {
    return this.path('server');
  },
};
