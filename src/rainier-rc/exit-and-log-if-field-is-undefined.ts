import { AssertionError } from 'assert';

export const exitAndLogIfFieldIsUndefined = (field: any, errorMsg: string): void | never => {
  if (!field) {
    throw new AssertionError({ message: errorMsg });
  }
};
