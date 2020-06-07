import path from 'path';
import { program } from 'commander';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import getTemplates from './templates';

const resolveOutDir = (relativeOutDirPath: string): string =>
  path.join(`${process.cwd()}/${relativeOutDirPath}`);

const args = program
  .option('-o, --out-dir <dir>', 'Output directory of new rainier project', resolveOutDir)
  .option('--js, --javascript', 'Scaffold project using javascript instead of typescript', false)
  .parse(process.argv)
  .opts();

const { useJs, outDir } = {
  useJs: args.javascript,
  outDir: args.outDir ?? process.cwd(),
} as const;

if (existsSync(outDir)) {
  throw new Error(`Can't create new rainier project in "${outDir}". Directory already exists`);
}

const templates = getTemplates(useJs);
const baseExtension = useJs ? 'js' : 'ts';
const reactBaseExtension = `${baseExtension}x`;

mkdirSync(outDir);
writeFileSync(`${outDir}/package.json`, templates.packageJson);
mkdirSync(`${outDir}/src`);
mkdirSync(`${outDir}/src/controllers`);
mkdirSync(`${outDir}/src/components`);
mkdirSync(`${outDir}/src/stores`);
mkdirSync(`${outDir}/src/stores/init`);
mkdirSync(`${outDir}/src/views`);
writeFileSync(`${outDir}/.gitignore`, templates.gitignore);
templates.tsconfig ? writeFileSync(`${outDir}/tsconfig.json`, templates.tsconfig) : null;
writeFileSync(
  `${outDir}/src/controllers/todo-controller.${baseExtension}`,
  templates.todoController
);
writeFileSync(`${outDir}/src/stores/todo-store.${baseExtension}`, templates.todoStore);
writeFileSync(`${outDir}/src/stores/index.${baseExtension}`, templates.todoStoreIndex);
writeFileSync(
  `${outDir}/src/stores/init/client-stores.${baseExtension}`,
  templates.initClientStores
);
writeFileSync(
  `${outDir}/src/stores/init/server-stores.${baseExtension}`,
  templates.initServerStores
);
writeFileSync(`${outDir}/src/controllers/index.${baseExtension}`, templates.controllerIndex);
writeFileSync(`${outDir}/src/components/app-shell.${reactBaseExtension}`, templates.appShell);
writeFileSync(`${outDir}/src/views/show-todos.${reactBaseExtension}`, templates.showTodos);
