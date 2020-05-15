import path from 'path';
import { RainierRC } from '../../rainier-rc';
import { readdirSync, writeFileSync } from 'fs';
import { pascalCase } from 'pascal-case';
import { camelCase } from 'camel-case';

interface StoreData {
  importString: string;
  pascalStoreName: string;
  reducerName: string;
  providerName: string;
  camelStoreName: string;
}

export const generateStoreProviders = (rainierRc: RainierRC): void => {
  let storeData: StoreData[] = [];
  if (rainierRc.storesDir) {
    storeData = readdirSync(rainierRc.storesDir)
      .map((store) => store.match(/(?<name>.*-store)\.(?<ext>.*)/))
      .filter((store) => store?.groups?.name)
      .map((store) => ({
        storeFileName: store!!.groups!!.name,
        reducerName: `${camelCase(store!!.groups!!.name)}Reducer`,
        providerName: `${pascalCase(store!!.groups!!.name)}Provider`,
        pascalStoreName: pascalCase(store!!.groups!!.name),
        camelStoreName: camelCase(store!!.groups!!.name),
      }))
      .map(({ storeFileName, reducerName, providerName, pascalStoreName, camelStoreName }) => ({
        reducerName,
        providerName,
        camelStoreName,
        pascalStoreName,
        importString: `import { ${providerName} } from '../rainier-store/${storeFileName}/context';`,
      }));
  }

  const template = `import React, { useReducer, useEffect } from 'react';
import { ServerContextStoreProvider } from '../rainier-store/server-context-store';
import { AllStoreContextProvider } from '../rainier-store/all-store-context';
import { debounce } from '../rainier-util';
${storeData.map(({ importString }) => importString).join('\n')}

export const StoreProviders = ({
  children,
  stores
}) => {
  const serverContextStore = stores.get('serverContextStore');

  const serverContextStoreReducer = useReducer(
    serverContextStore.updateState,
    serverContextStore.state
  );

  ${storeData
    .map(({ camelStoreName }) => `const ${camelStoreName} = stores.get('${camelStoreName}');`)
    .join('\n  ')}

  ${storeData
    .map(
      ({ reducerName, camelStoreName }) =>
        `const ${reducerName} = useReducer(${camelStoreName}.updateState, ${camelStoreName}.state);`
    )
    .join('\n  ')}

  useEffect(() => {
    ${storeData
      .map(
        ({ reducerName, camelStoreName }) =>
          `${camelStoreName}.dispatch = debounce(${reducerName}[1], 10);`
      )
      .join('\n    ')}
  });

  return (
    <AllStoreContextProvider value={stores}>
      <ServerContextStoreProvider value={serverContextStoreReducer}>
        ${storeData
          .map(({ providerName, reducerName }) => `<${providerName} value={${reducerName}}>`)
          .join('\n')}
        {children}
        ${storeData
          .reverse()
          .map(({ providerName }) => `</${providerName}>`)
          .join('\n')}
      </ServerContextStoreProvider>
    </AllStoreContextProvider>
  );
};
  `;

  writeFileSync(
    path.join(__dirname, '../../../src/rainier-components/StoreProviders.tsx'),
    template
  );
};
