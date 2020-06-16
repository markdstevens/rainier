import path from 'path';
import { RainierRCConfiguration } from '../rainierrc-configuration';
import { fileOrDirExists } from '../helpers/file-or-dir-exists';
import type { RainierRC, RainierHooks } from '../types';

export class RainierHooksConfiguration extends RainierRCConfiguration {
  public readonly configName: keyof RainierRC = 'rainierHooks';
  public readonly isRequired = false;
  public readonly defaultConfigValue: RainierHooks = {
    client: './src/rainier-hooks/client',
    server: './src/rainier-hooks/server',
  };

  transformConfig(rainierHooks: RainierHooks): RainierHooks {
    const client = path.join(process.cwd(), rainierHooks?.client ?? '');
    const server = path.join(process.cwd(), rainierHooks?.server ?? '');

    return {
      client,
      server,
    };
  }

  isValid(rainierHooks: RainierHooks): boolean {
    const exts = ['js', 'ts'];
    return (
      fileOrDirExists(rainierHooks?.server ?? '', exts) &&
      fileOrDirExists(rainierHooks?.client ?? '', exts)
    );
  }
}
