import path from 'path';
import { existsSync } from 'fs';
import { RainierRCConfiguration } from '../rainierrc-configuration';
import { fileOrDirExists } from '../helpers/file-or-dir-exists';
import type { RainierRC } from '../types';

export class PublicAssetsDirConfig extends RainierRCConfiguration {
  public readonly configName: keyof RainierRC = 'publicAssetsDir';
  public readonly defaultConfigValue = './src/public';
  public readonly isRequired = false;

  transformConfig(publicAssetsDir: string): string {
    const resolvedPath = path.join(process.cwd(), publicAssetsDir);
    return existsSync(resolvedPath) ? resolvedPath : '';
  }

  isValid(publicAssetsDir: string): boolean {
    return fileOrDirExists(publicAssetsDir);
  }
}
