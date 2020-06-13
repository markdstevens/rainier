import { controllerRegistry } from './registry';
import { Controller } from './types';

const { default: controllers } = require(__CONTROLLERS_MANIFEST__);

export const registerControllers = (): void =>
  controllers.forEach((controller: Controller) =>
    controllerRegistry.registerController(controller)
  );
