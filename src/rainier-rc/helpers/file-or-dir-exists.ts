import { existsSync } from 'fs';

export const fileOrDirExists = (path: string, extensions?: string[]): boolean =>
  (existsSync(path) || extensions?.some((ext) => existsSync(`${path}.${ext}`))) ?? false;
