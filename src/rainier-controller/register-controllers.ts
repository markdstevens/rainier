import { controllerRegistry } from './controller-registry';
import { Controller } from './types';

const { default: controllers } = require(__CONTROLLERS_DIR__);

export const registerControllers = (): void =>
  controllers.forEach((controller: Controller) =>
    controllerRegistry.registerController(controller)
  );
