import { RainierRC } from '../../../rainier-rc';
import { readdirSync } from 'fs';
import { pascalCase } from 'pascal-case';
import { camelCase } from 'camel-case';

interface StoreMetaData {
  storeFileName: string;
  reducerName: string;
  providerName: string;
  contextName: string;
  pascalStoreName: string;
  camelStoreName: string;
}

export const getStoreMetaData = (rainierRc: RainierRC): StoreMetaData[] => {
  return readdirSync(rainierRc.storesDir)
    .map((store) => store.replace('.ts', ''))
    .filter((store) => store.endsWith('-store'))
    .map((store) => ({
      storeFileName: store,
      reducerName: `${camelCase(store)}Reducer`,
      providerName: `${pascalCase(store)}Provider`,
      contextName: `${pascalCase(store)}Context`,
      pascalStoreName: pascalCase(store),
      camelStoreName: camelCase(store),
    }));
};
