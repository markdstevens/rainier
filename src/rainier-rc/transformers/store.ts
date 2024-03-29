import path from 'path';
import { RainierRCConfiguration } from '../rainierrc-configuration';
import { fileOrDirExists } from '../helpers/file-or-dir-exists';
import type { RainierRC, StoreConfig } from '../types';

export class StoreConfiguration extends RainierRCConfiguration {
  public readonly configName: keyof RainierRC = 'store';
  public readonly isRequired = false;
  public readonly defaultConfigValue: StoreConfig = {
    initClientStores: './src/stores/init/client',
    initServerStores: './src/stores/init/server',
  };

  transformConfig(storeConfig: StoreConfig): StoreConfig {
    const initClientStores = path.join(process.cwd(), storeConfig?.initClientStores ?? '');
    const initServerStores = path.join(process.cwd(), storeConfig?.initServerStores ?? '');

    return {
      initClientStores,
      initServerStores,
    };
  }

  isValid(storeConfig: StoreConfig): boolean {
    const exts = ['js', 'ts'];
    const initClientStoresExists = fileOrDirExists(storeConfig?.initClientStores, exts) ?? false;
    const initServerStoresExists = fileOrDirExists(storeConfig?.initServerStores, exts) ?? false;

    return initClientStoresExists && initServerStoresExists;
  }
}
