import { Dispatch } from 'react';
import { StoreConstructorFunction } from './internal-types';

export interface IStore<T = any> {
  /**
   * The object that contains each store's data. Every field
   * declared inside "state" will be automatically reactive.
   */
  state: T;
  /**
   * Returns true if the store is defined by the rainier framework. Will
   * always return false if the store is an application, user-defined store.
   */
  isPlatformStore?: boolean;
  /**
   * An internal of the base store. Don't touch.
   */
  updateState(prevState: T, nextState: T): T;
  /**
   * An internal of the base store. Don't touch.
   */
  dispatch: Dispatch<T>;
  /**
   * An internal of the base store. Don't touch.
   */
  context: React.Context<T>;
}

/**
 * Only the "get" function should be used directly. Stores can be retrieved
 * like this:
 *
 *   const allStores = React.useContext(ServerContextStore);
 *   const todoStore = allStores.get(TodoStore);
 */
export interface Stores {
  stores: StoreMap;
  get<T extends StoreConstructorFunction>(storeName: T): InstanceType<T> | never;
}

export interface StoreMap {
  [key: string]: IStore;
}
