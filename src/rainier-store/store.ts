export class Store {
  constructor(public store: Record<string, any>) {}

  toJSON(): Record<string, any> {
    const store = this.store;
    const obj = {} as Record<string, any>;
    Object.keys(store)
      .filter((name) => {
        const isGetter = Object.getOwnPropertyDescriptor(store, name)?.get !== undefined ?? false;
        const isSetter = Object.getOwnPropertyDescriptor(store, name)?.set !== undefined ?? false;
        const isFunction = typeof store[name] === 'function';

        return !isGetter && !isSetter && !isFunction;
      })
      .forEach((field) => (obj[field] = store[field]));
    return obj;
  }
}
