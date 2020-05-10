import path from 'path';
import { writeFileSync } from 'fs';
import { RainierRC } from '../../rainier-rc';

export const generateCssGlobalImport = (rainierRc: RainierRC): void => {
  writeFileSync(
    path.join(__dirname, '../../rainier-client/css-global-import.js'),
    `import "${rainierRc.cssGlobalFile}"`
  );
};
