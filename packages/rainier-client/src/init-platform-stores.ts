import { LocalizationStore, ServerContextStore, StoreMap } from '@rainier/store';

export function initPlatformClientStores(serializedData: StoreMap): StoreMap {
  return {
    serverContextStore: new ServerContextStore(serializedData.serverContextStore.state),
    localizationStore: new LocalizationStore(serializedData.localizationStore.state),
  };
}
