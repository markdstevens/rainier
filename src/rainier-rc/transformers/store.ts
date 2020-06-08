import path from 'path';
import { RainierRCConfiguration } from '../rainierrc-configuration';
import { RainierRC, StoreConfig } from '../rainier-rc';
import { fileOrDirExists } from '../helpers/file-or-dir-exists';

export class StoreConfiguration extends RainierRCConfiguration {
  public readonly configName: keyof RainierRC = 'store';
  public readonly isRequired = false;
  public readonly defaultConfigValue: StoreConfig = {
    initClientStores: './src/stores/init/client',
    initServerStores: './src/stores/init/server',
  };

  transformConfig(storeConfig: StoreConfig): StoreConfig {
    const initClientStores = path.join(process.cwd(), storeConfig?.initClientStores) ?? '';
    const initServerStores = path.join(process.cwd(), storeConfig?.initServerStores) ?? '';

    return {
      initClientStores,
      initServerStores,
    };
  }

  isValid(storeConfig: StoreConfig): boolean {
    const extensions = ['js', 'ts'];
    const initClientStoresExists = fileOrDirExists(storeConfig?.initClientStores, extensions) ?? '';
    const initServerStoresExists = fileOrDirExists(storeConfig?.initServerStores, extensions) ?? '';

    return initClientStoresExists && initServerStoresExists;
  }
}
