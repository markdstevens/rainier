import path from 'path';
import { NodePlopAPI } from 'plop';

export default function (plop: NodePlopAPI): void {
  plop.setGenerator('Create rainier app', {
    description: 'Generate new rainier app',
    prompts: [
      {
        type: 'input',
        name: 'appName',
        message: 'App name',
      },
      {
        type: 'list',
        name: 'language',
        message: 'Which language?',
        choices: ['javascript', 'typescript'],
      },
    ],
    actions: function (data) {
      return [
        {
          type: 'addMany',
          destination: path.join(process.cwd(), `./${data?.appName}/`),
          base: `./templates/${data?.language}`,
          templateFiles: `./templates/${data?.language}/**/*.hbs`,
          globOptions: {
            dot: true,
          },
        },
      ];
    },
  });
}
