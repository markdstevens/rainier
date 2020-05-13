import path from 'path';
import { RainierRCConfiguration } from '../rainierrc-configuration';
import { RainierRC } from '../rainier-rc';
import { fileOrDirExists } from '../helpers/file-or-dir-exists';

export class StoresDirConfig extends RainierRCConfiguration {
  public readonly configName: keyof RainierRC = 'storesDir';
  public readonly defaultConfigValue = './src/stores';

  transformConfig(storesDir: string): string {
    return path.join(process.cwd(), storesDir);
  }

  validate(storesDir: string): void | never {
    this.failValidationIf(!fileOrDirExists(storesDir));
  }
}
