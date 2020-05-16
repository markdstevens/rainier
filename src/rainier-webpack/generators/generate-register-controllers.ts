import path from 'path';
import { readdirSync, writeFileSync } from 'fs';
import { pascalCase } from 'pascal-case';
import { RainierRC } from '../../rainier-rc';

export const generateRegisterControllers = ({ controllersDir }: RainierRC): void => {
  const controllers = readdirSync(controllersDir);
  const controllerData = controllers
    .map((controller) => controller.match(/(?<name>.*-controller)\.(?<ext>.*)/))
    .filter((controller) => controller?.groups?.name)
    .map((controller) => ({
      controllerName: pascalCase(controller!!.groups!!.name),
      controllerFileName: controller!!.groups!!.name,
    }));

  const imports = `${controllerData
    .map(
      ({ controllerName, controllerFileName }) =>
        `import ${controllerName} from '${controllersDir}/${controllerFileName}';`
    )
    .join('\n')}`;

  const template = `${imports}
  import { controllerRegistry } from './controller-registry';
  export function registerControllers() {
    ${controllerData
      .map(({ controllerName }) => `controllerRegistry.register(${controllerName});`)
      .join('\n')}
  }
  `;

  writeFileSync(
    path.join(__dirname, '../../../src/rainier-controller/register-controllers.ts'),
    template
  );
};
