import path from 'path';
import { RainierRCConfiguration } from '../rainierrc-configuration';
import { RainierRC } from '../rainier-rc';
import { fileOrDirExists } from '../helpers/file-or-dir-exists';

export class ControllersDirConfig extends RainierRCConfiguration {
  public readonly configName: keyof RainierRC = 'controllersDir';
  public readonly defaultConfigValue = './src/controllers';
  public readonly isRequired = true;

  transformConfig(controllerDir: string): string {
    return path.join(process.cwd(), controllerDir);
  }

  isValid(controllerDir: string): boolean {
    return fileOrDirExists(controllerDir);
  }
}