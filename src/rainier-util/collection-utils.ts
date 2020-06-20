export const collectionUtils = {
  isNotNullOrUndefined: function <T>(value?: T | null): value is T {
    return value !== null && value !== undefined;
  },
};
