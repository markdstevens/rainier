import path from 'path';
import { RainierRCConfiguration } from '../rainierrc-configuration';
import { RainierRC } from '../rainier-rc';
import { fileOrDirExists } from '../helpers/file-or-dir-exists';

export class CssGlobalFileConfig extends RainierRCConfiguration {
  public readonly configName: keyof RainierRC = 'cssGlobalFile';
  public readonly defaultConfigValue = './src/styles/global.scss';

  transformConfig(cssGlobalFilePath: string): string {
    return path.join(process.cwd(), cssGlobalFilePath);
  }

  validate(cssGlobalFilePath: string): void | never {
    this.failValidationIf(!fileOrDirExists(cssGlobalFilePath));
  }
}
