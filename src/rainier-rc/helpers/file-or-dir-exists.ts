import { existsSync } from 'fs';

export const fileOrDirExists = (path: string): boolean => existsSync(path);
