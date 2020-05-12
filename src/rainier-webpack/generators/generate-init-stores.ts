import path from 'path';
import { RainierRC } from '../../rainier-rc';
import { readdirSync, writeFileSync } from 'fs';
import { pascalCase } from 'pascal-case';
import { camelCase } from 'camel-case';

export const generateInitStores = (rainierRc: RainierRC): void => {
  const storeData = readdirSync(rainierRc.storesDir)
    .map((store) => store.replace('.ts', ''))
    .filter((store) => store.endsWith('-store'))
    .map((store) => ({
      storeFileName: store,
      pascalStoreName: pascalCase(store),
      camelStoreName: camelCase(store),
    }))
    .map(({ storeFileName, pascalStoreName, camelStoreName }) => ({
      storeFileName,
      pascalStoreName,
      importString: `import { ${pascalStoreName} } from '${rainierRc.storesDir}/${storeFileName}';`,
      server: {
        initStore: `${camelStoreName}: new ${pascalStoreName}({})`,
      },
      client: {
        initStore: `${camelStoreName}: new ${pascalStoreName}(serializedStores.${camelStoreName}.state)`,
      },
    }));

  const imports = `${storeData.map(({ importString }) => importString).join('\n')}
  `;

  const serverTemplate = `${imports}
export function initCustomServerStores() {
  return {
    ${storeData.map(({ server }) => server.initStore).join(',\n    ')}
  };
}
  `;

  const clientTemplate = `${imports}
export function initCustomClientStores(serializedStores) {
  return {
    ${storeData.map(({ client }) => client.initStore).join(',\n    ')}
  };
}
  `;

  writeFileSync(
    path.join(__dirname, '../../../src/rainier-client/init-custom-client-stores.ts'),
    clientTemplate
  );
  writeFileSync(
    path.join(__dirname, '../../../src/rainier-server/init-custom-server-stores.ts'),
    serverTemplate
  );
};
