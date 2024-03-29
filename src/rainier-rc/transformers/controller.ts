import path from 'path';
import { RainierRCConfiguration } from '../rainierrc-configuration';
import { fileOrDirExists } from '../helpers/file-or-dir-exists';
import type { RainierRC, ControllerConfig } from '../types';

export class ControllerConfiguration extends RainierRCConfiguration {
  public readonly configName: keyof RainierRC = 'controller';
  public readonly isRequired = true;
  public readonly defaultConfigValue: ControllerConfig = {
    manifest: './src/controllers/manifest',
  };

  transformConfig(controller: ControllerConfig): ControllerConfig {
    return {
      manifest: path.join(process.cwd(), controller?.manifest),
    };
  }

  isValid(controller: ControllerConfig): boolean {
    return fileOrDirExists(controller?.manifest, ['ts', 'js']);
  }
}
