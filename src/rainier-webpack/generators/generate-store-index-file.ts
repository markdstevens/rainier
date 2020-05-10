import path from 'path';
import { RainierRC } from '../../rainier-rc';
import { getStoreMetaData } from './helpers/get-store-meta-data';
import { writeFileSync } from 'fs';

export const generateStoreIndexFile = (rainierRc: RainierRC): void => {
  const applicationStoreExports = getStoreMetaData(rainierRc)
    .map((store) => `export * from './${store.storeFileName}';`)
    .join('\n');
  const existingImports = `export * from './all-store-context';
export * from './base-store';
export * from './types';`;

  const indexTemplate = [applicationStoreExports, existingImports].join('\n');

  writeFileSync(path.join(__dirname, '../../rainier-store/index.js'), indexTemplate);
  writeFileSync(path.join(__dirname, '../../rainier-store/index.d.ts'), indexTemplate);
};
