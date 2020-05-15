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
  if (rainierRc.storesDir) {
    return readdirSync(rainierRc.storesDir)
      .map((store) => store.match(/(?<name>.*-store)\.(?<ext>.*)/))
      .map((store) => store?.groups?.name)
      .filter((storeName) => storeName)
      .map((store) => {
        const nonNullStore = store as string;
        return {
          storeFileName: nonNullStore,
          reducerName: `${camelCase(nonNullStore)}Reducer`,
          providerName: `${pascalCase(nonNullStore)}Provider`,
          contextName: `${pascalCase(nonNullStore)}Context`,
          pascalStoreName: pascalCase(nonNullStore),
          camelStoreName: camelCase(nonNullStore),
        };
      });
  }

  return [];
};
