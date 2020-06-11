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
  /**
   * Any keys specified in this list will be excluded from
   * the serialized stores that get passed to the client.
   */
  keysToExcludeFromSerializedStores: string[];
}

/**
 * These are the fields that exist on the store class but should not be exposed
 * to clients of the rainier project. These are internal details of the store
 * class.
 */
export type PrivateStoreMembers = 'updateState' | 'dispatch' | 'context' | 'isPlatformStore';

/**
 * Only the "get" function should be used directly. Stores can be retrieved
 * like this:
 *
 *   const allStores = React.useContext(ServerContextStore);
 *   const todoStore = allStores.get(TodoStore);
 */
export interface Stores {
  stores: StoreMap;
  get<T extends StoreConstructorFunction>(
    storeName: T
  ): Omit<InstanceType<T>, PrivateStoreMembers> | never;
}

export interface StoreMap {
  [key: string]: IStore;
}

export type StoreKeys = keyof IStore;
