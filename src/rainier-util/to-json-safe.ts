export const toJSON = function (this: Record<string, any>): Record<string, any> {
  const obj = {} as Record<string, any>;
  Object.keys(this)
    .filter((prop) => this.hasOwnProperty(prop))
    .filter((name) => {
      const isGetter = Object.getOwnPropertyDescriptor(this, name)?.get !== undefined ?? false;
      const isSetter = Object.getOwnPropertyDescriptor(this, name)?.set !== undefined ?? false;
      const isFunction = typeof this[name] === 'function';

      return !isGetter && !isSetter && !isFunction;
    })
    .forEach((field) => (obj[field] = this[field]));
  return obj;
};
