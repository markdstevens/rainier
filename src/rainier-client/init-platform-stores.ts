import { ServerContextStore } from '../rainier-store/server-context-store';
import { LocalizationStore } from '../rainier-store/localization-store';
import { StoreMap } from '../rainier-store/types';

export function initPlatformClientStores(serializedData: StoreMap): StoreMap {
  return {
    serverContextStore: new ServerContextStore(serializedData.serverContextStore.state),
    localizationStore: new LocalizationStore(serializedData.localizationStore.state),
  };
}
