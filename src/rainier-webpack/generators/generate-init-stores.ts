import path from 'path';
import { RainierRC } from '../../rainier-rc';
import { readdirSync, writeFileSync } from 'fs';
import { pascalCase } from 'pascal-case';
import { camelCase } from 'camel-case';

interface InitStore {
  initStore: string;
}

interface StoreData {
  storeFileName: string;
  pascalStoreName: string;
  importString: string;
  server: InitStore;
  client: InitStore;
}

export const generateInitStores = (rainierRc: RainierRC): void => {
  let storeData: StoreData[] = [];
  if (rainierRc.storesDir) {
    storeData = readdirSync(rainierRc.storesDir)
      .map((store) => store.match(/(?<name>.*-store)\.(?<ext>.*)/))
      .filter((store) => store?.groups?.name)
      .map((store) => ({
        storeFileName: store!!.groups!!.name,
        pascalStoreName: pascalCase(store!!.groups!!.name),
        camelStoreName: camelCase(store!!.groups!!.name),
      }))
      .map(({ storeFileName, pascalStoreName, camelStoreName }) => ({
        storeFileName,
        pascalStoreName,
        importString: `import { ${pascalStoreName} } from '${rainierRc.storesDir}/${storeFileName}';`,
        server: {
          initStore: `${camelStoreName}: new ${pascalStoreName}({}, ${pascalStoreName}.getDefaultState ? ${pascalStoreName}.getDefaultState() : {})`,
        },
        client: {
          initStore: `${camelStoreName}: new ${pascalStoreName}(serializedStores.${camelStoreName}.state, ${pascalStoreName}.getDefaultState ? ${pascalStoreName}.getDefaultState() : {})`,
        },
      }));
  }

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
