import path from 'path';
import { readdirSync, writeFileSync } from 'fs';
import { pascalCase } from 'pascal-case';
import { RainierRC } from '../../rainier-rc';

export const generateInitControllers = ({ controllersDir }: RainierRC): void => {
  const controllers = readdirSync(controllersDir);
  const controllerData = controllers
    .filter((controller) => controller.includes('-controller'))
    .map((controller) => controller.replace('.ts', ''))
    .map((controller) => ({
      controllerName: pascalCase(controller),
      controllerFileName: controller,
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

  writeFileSync(path.join(__dirname, '../../rainier-controller/init-controllers.js'), template);
};
