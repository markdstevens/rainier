/**
 * Data stores are integral to the rainier ecosystem. Stores
 * are simply functions that return an object which matches
 * this schema. Under the hood, the properties and functions
 * of the store are made reactive through the use of mobx and
 * mobx-react-lite.
 *
 * Stores can be accessed in two contexts:
 *   1. Any controller's "fetch" method through fetchOptions.stores
 *   2. Any functional component through the useStore hook
 *
 * When you want a component to react to state changes in the data
 * store, you need to wrap the component in the useObserver hook
 * which can be imported from rainier. This useObserver hook is 100%
 * identical to mobx's useObserver hook, and it's only wrapped so that
 * future backwards compatible changes can be made to the store API without
 * breaking everyone's applications.
 */
interface Store<T = any> {
  [key: string]: any;
  /**
   * A default toJSON function is automatically applied to the store which
   * should be sufficient in the vast majority of cases. If this is not
   * sufficient for your use case, then you can elect to override it by
   * supplying your own implementation.
   */
  toJSON?: () => Partial<T>;
}

/**
 * A map of storeName -> store instance. The store name is identical to the
 * name of the store in the init files (e.g stores/init/*.ts)
 */
interface Stores {
  [key: string]: Store;
}
/**
 * A rainier store that is automatically provided and can be accessed
 * via any of the normal means.
 *
 * For example:
 *   const serverContextStore = useStore<ServerContextStore>('serverContextStore');
 *   console.log(serverContextStore.location); // server URL location
 */
interface ServerContextStore {
  /**
   * The URL that triggered the original server side render. This field will never
   * be updated, even if react-router's route has changed.
   */
  location: string;
  /**
   * Will be true on the SSR, otherwise false
   */
  isServerLoad: boolean;
  /**
   * This is an internal function of the rainier framework. No touchy unless you
   * want your application to explode.
   *
   * @param isServerLoad The new value to set.
   */
  setIsServerLoad(isServerLoad: boolean): void;
  /**
   *
   */
  isAppShellRequest: boolean;
}

/**
 *
 */
interface StoresWithRetriever {
  [key: string]: Store;
  stores: Stores;
  get<T extends Store>(name: string): T;
}

export type { Store, Stores, ServerContextStore, StoresWithRetriever };
