import { RainierRC } from '../../rainier-rc';
import { generateRegisterControllers } from './generate-register-controllers';
import { generateCssGlobalImport } from './generate-css-global-import';
import { generateInitStores } from './generate-init-stores';
import { generateStoreProviders } from './generate-store-providers';
import { generateStoreDir } from './generate-store-dir';
import { generateStoreIndexFile } from './generate-store-index-file';
import { generateAppShell } from './generate-app-shell';

export const generatePreBuildFiles = (rainierRc: RainierRC): void => {
  generateRegisterControllers(rainierRc);
  generateCssGlobalImport(rainierRc);
  generateInitStores(rainierRc);
  generateStoreProviders(rainierRc);
  generateStoreDir(rainierRc);
  generateStoreIndexFile(rainierRc);
  generateAppShell(rainierRc);
};
