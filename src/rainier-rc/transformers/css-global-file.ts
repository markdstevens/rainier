import path from 'path';
import { RainierRCConfiguration } from '../rainierrc-configuration';
import { RainierRC } from '../rainier-rc';
import { fileOrDirExists } from '../helpers/file-or-dir-exists';

export class CssGlobalFileConfig extends RainierRCConfiguration {
  public readonly configName: keyof RainierRC = 'cssGlobalFile';
  public readonly defaultConfigValue = './src/styles/global';
  public readonly isRequired = false;

  transformConfig(cssGlobalFilePath: string): string {
    return path.join(process.cwd(), cssGlobalFilePath);
  }

  isValid(cssGlobalFilePath: string): boolean {
    return fileOrDirExists(cssGlobalFilePath, ['scss', 'sass', 'css', 'less']);
  }
}
