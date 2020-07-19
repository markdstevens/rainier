import type { Controller } from './types';

export function getControllers(): Controller[] {
  const controllers = require(__CONTROLLERS__);
  if (controllers && controllers.default) {
    return controllers.default;
  }

  return [];
}
