import path from 'path';
import { writeFileSync } from 'fs';
import { RainierRC } from '../../rainier-rc';

export const generateCssGlobalImport = (rainierRc: RainierRC): void => {
  writeFileSync(
    path.join(__dirname, '../../../src/rainier-client/css-global-import.ts'),
    rainierRc.cssGlobalFile ? `import "${rainierRc.cssGlobalFile}"` : `export {};`
  );
};
