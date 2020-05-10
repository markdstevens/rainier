import path from 'path';
import rimraf from 'rimraf';
import { RainierRC } from '../../rainier-rc';
import { getStoreMetaData } from './helpers/get-store-meta-data';
import { mkdirSync, writeFileSync } from 'fs';

export const generateStoreDir = (rainierRc: RainierRC): void => {
  getStoreMetaData(rainierRc).forEach((store) => {
    const storeDir = path.join(__dirname, `../../rainier-store/${store.storeFileName}`);
    const contextFilePath = `${storeDir}/context.js`;
    const useStoreFilePath = `${storeDir}/use${store.pascalStoreName}.js`;
    const useStoreDescriptionFilePath = `${storeDir}/use${store.pascalStoreName}.d.ts`;
    const indexFilePath = `${storeDir}/index.js`;
    const indexFileDescriptionPath = `${storeDir}/index.d.ts`;

    rimraf.sync(storeDir);
    mkdirSync(storeDir);

    const contextTemplate = `import { createContext } from 'react';

export const ${store.contextName} = createContext({});
export const ${store.providerName} = ${store.contextName}.Provider;
    `;

    const useStoreTemplate = `import { useContext } from 'react';
import { ${store.contextName} } from './context';

export const use${store.pascalStoreName} = () => useContext(${store.contextName});
    `;

    const useStoreDescriptionTemplate = `export declare function use${store.pascalStoreName}<T>(): [T, never];
    `;

    const indexTemplate = `export * from './context';
export * from './use${store.pascalStoreName}';
`;

    writeFileSync(contextFilePath, contextTemplate);
    writeFileSync(useStoreFilePath, useStoreTemplate);
    writeFileSync(useStoreDescriptionFilePath, useStoreDescriptionTemplate);
    writeFileSync(indexFilePath, indexTemplate);
    writeFileSync(indexFileDescriptionPath, indexTemplate);
  });
};
