import path from 'path';
import { RainierRCConfiguration } from '../rainierrc-configuration';
import { RainierRC } from '../rainier-rc';
import { fileOrDirExists } from '../helpers/file-or-dir-exists';
import { existsSync } from 'fs';

export class StoresDirConfig extends RainierRCConfiguration {
  public readonly configName: keyof RainierRC = 'storesDir';
  public readonly defaultConfigValue = './src/stores';
  public readonly isRequired = false;

  transformConfig(storesDir: string): string {
    const resolvedStoresDir = path.join(process.cwd(), storesDir);
    return existsSync(resolvedStoresDir) ? resolvedStoresDir : '';
  }

  isValid(storesDir: string): boolean {
    return fileOrDirExists(storesDir);
  }
}
