import React from 'react';
import { bindProxyHandler } from 'rainier-util/store-state-proxy';
import type { IStore, StoreKeys } from './types';

/**
 * This is the base class that all other stores must extend from.
 * This class is what provides reactivity to the stores' state
 * objects. Nothing in this class or exposed by this super class
 * should be touched in any way. All details of this super class
 * should be considered internals of the rainier framework.
 */
export abstract class Store<T> implements IStore<T> {
  /**
   * Returns true if the store is defined by the rainier framework. Will
   * always return false if the store is an application, user-defined store.
   */
  public isPlatformStore = false;
  /**
   * An internal of the base store. Don't touch.
   */
  public context = React.createContext({} as T);
  /**
   * Any keys specified in this list will be excluded from
   * the serialized stores that get passed to the client.
   */
  public keysToExcludeFromSerializedStores: StoreKeys[] = [
    'context',
    'keysToExcludeFromSerializedStores',
  ];
  /**
   * The object that contains each store's data. Every field
   * declared inside "state" will be automatically reactive.
   */
  public state: T;
  /**
   * An internal of the base store. Don't touch.
   */
  private getProxy: (state: T) => T;
  /**
   * The constructor takes in the initial state and the default state
   * of the store. The default state will be used first, and then each
   * field in "initialState" that also exists in "defaultState" will
   * override the value from the default state.
   *
   * @param initialState The initial state of the store
   * @param defaultState The default state of the store
   */
  constructor(initialState: T, defaultState: T | {} = {}) {
    this.getProxy = bindProxyHandler((newState: T) => this.dispatch(newState));

    this.state = this.getProxy(Object.assign({}, defaultState, initialState));

    this.updateState = this.updateState.bind(this);
    this.dispatch = this.dispatch.bind(this);
  }
  /**
   * An internal of the base store. Don't touch.
   */
  public updateState(prevState: T, nextState: T): T {
    this.state = this.getProxy(Object.assign({}, prevState, nextState));
    return this.state;
  }
  /**
   * An internal of the base store. Don't touch.
   */
  public dispatch(newState: T): void {
    /* is overriden in StoreProviders.tsx  */
  }
  /**
   * This function overrides the default behavior of JSON.stringify by
   * specifying specific fields to exclude in the output string. Concrete
   * implementations of the Store class can extends the behavior of this
   * function by supplying a list of key names as a parameter. All specified
   * keys will also be excluded from the output of JSON.stringify.
   *
   * @param customKeysToExclude A list of keys to exclude from serialized store
   *
   * Concrete stores can invoke this method via "super.toJSON(['key1', 'key2'])"
   */
  public toJSON(customKeysToExclude: string[] = []): IStore {
    const objWithoutKeys: { [key: string]: undefined } = {};
    for (const key of [...this.keysToExcludeFromSerializedStores, ...customKeysToExclude]) {
      objWithoutKeys[key] = undefined;
    }

    return Object.assign({}, this, objWithoutKeys);
  }
}
