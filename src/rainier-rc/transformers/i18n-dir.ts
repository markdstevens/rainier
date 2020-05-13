import path from 'path';
import { RainierRCConfiguration } from '../rainierrc-configuration';
import { RainierRC } from '../rainier-rc';
import { fileOrDirExists } from '../helpers/file-or-dir-exists';

export class I18NDirConfig extends RainierRCConfiguration {
  public readonly configName: keyof RainierRC = 'i18nDir';
  public readonly defaultConfigValue = './src/i18n';

  transformConfig(i18nDir: string): string {
    return path.join(process.cwd(), i18nDir);
  }

  validate(i18nDir: string): void | never {
    this.failValidationIf(!fileOrDirExists(i18nDir));
  }
}
