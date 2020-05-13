import path from 'path';
import { RainierRCConfiguration } from '../rainierrc-configuration';
import { RainierRC } from 'rainier-rc/rainier-rc';
import { fileOrDirExists } from '../helpers/file-or-dir-exists';

export class PublicAssetsDirConfig extends RainierRCConfiguration {
  public readonly configName: keyof RainierRC = 'publicAssetsDir';
  public readonly defaultConfigValue = './src/public';

  transformConfig(publicAssetsDir: string): string {
    return path.join(process.cwd(), publicAssetsDir);
  }

  validate(publicAssetsDir: string): void | never {
    this.failValidationIf(!fileOrDirExists(publicAssetsDir));
  }
}
