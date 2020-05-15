import path from 'path';
import { readdirSync, writeFileSync } from 'fs';
import { pascalCase } from 'pascal-case';
import { RainierRC } from '../../rainier-rc';

export const generateInitControllers = ({ controllersDir }: RainierRC): void => {
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
        `import { ${controllerName} } from '${controllersDir}/${controllerFileName}';`
    )
    .join('\n')}`;

  const template = `${imports}
  export function initControllers() {
    return [
      ${controllerData
        .map(({ controllerName }) => `new ${controllerName}('${controllerName}')`)
        .join(', ')}
    ];
  }
  `;

  writeFileSync(
    path.join(__dirname, '../../../src/rainier-controller/init-controllers.ts'),
    template
  );
};
