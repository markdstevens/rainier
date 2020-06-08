import path from 'path';
import { RainierRCConfiguration } from '../rainierrc-configuration';
import { RainierRC } from '../rainier-rc';
import { fileOrDirExists } from '../helpers/file-or-dir-exists';

export class AppShellConfig extends RainierRCConfiguration {
  public readonly configName: keyof RainierRC = 'appShell';
  public readonly defaultConfigValue = './src/components/app-shell';
  public readonly isRequired = false;

  transformConfig(appShellPath: string): string {
    return path.join(process.cwd(), appShellPath);
  }

  isValid(appShellPath: string): boolean {
    return fileOrDirExists(appShellPath, ['jsx', 'tsx']);
  }
}
