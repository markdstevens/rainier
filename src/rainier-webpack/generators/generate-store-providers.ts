import path from 'path';
import { RainierRC } from '../../rainier-rc';
import { readdirSync, writeFileSync } from 'fs';
import { pascalCase } from 'pascal-case';
import { camelCase } from 'camel-case';

export const generateStoreProviders = (rainierRc: RainierRC): void => {
  const storeData = readdirSync(rainierRc.storesDir)
    .map((store) => store.replace('.ts', ''))
    .filter((store) => store.endsWith('-store'))
    .map((store) => ({
      storeFileName: store,
      reducerName: `${camelCase(store)}Reducer`,
      providerName: `${pascalCase(store)}Provider`,
      pascalStoreName: pascalCase(store),
      camelStoreName: camelCase(store),
    }))
    .map(({ storeFileName, reducerName, providerName, pascalStoreName, camelStoreName }) => ({
      reducerName,
      providerName,
      camelStoreName,
      pascalStoreName,
      importString: `import { ${providerName} } from '../rainier-store/${storeFileName}/context';`,
    }));

  const applicationStoreElements = storeData.map(
    ({ providerName, reducerName }) => `
      React.createElement(
        ${providerName},
        {
          value: ${reducerName}
        }
    `
  );

  let stores = '';
  applicationStoreElements.forEach((store) => {
    stores += `, ${store}`;
  });
  stores += ', children)';
  applicationStoreElements.forEach((_) => (stores += ')'));

  const template = `import React, { useReducer, useEffect } from 'react';
import { ServerContextStoreProvider } from '../rainier-store/server-context-store';
import { AllStoreContextProvider } from '../rainier-store/all-store-context';
import { LocalizationStoreProvider } from '../rainier-store/localization-store';
import { debounce } from '../rainier-util';
${storeData.map(({ importString }) => importString).join('\n')}

export const StoreProviders = ({
  children,
  stores
}) => {
  const serverContextStore = stores.get('serverContextStore');
  const localizationStore = stores.get('localizationStore');

  const serverContextStoreReducer = useReducer(
    serverContextStore.updateState,
    serverContextStore.state
  );

  const localizationStoreReducer = useReducer(
    localizationStore.updateState,
    localizationStore.state
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
    React.createElement(
      AllStoreContextProvider,
      {
        value: stores
      },
      React.createElement(
        ServerContextStoreProvider,
        {
          value: serverContextStoreReducer
        },
        React.createElement(
          LocalizationStoreProvider,
          {
            value: localizationStoreReducer
          }
          ${stores}
        )
      )
    )
};
  `;

  writeFileSync(path.join(__dirname, '../../rainier-components/StoreProviders.js'), template);
};
