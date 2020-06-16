import { writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { getTemplates } from './templates';
import { program } from 'commander';
import chalk from 'chalk';
import path from 'path';

const resolveOutDir = (relativeOutDirPath: string): string =>
  path.join(`${process.cwd()}/${relativeOutDirPath}`);

let outputDirectory = process.cwd();
const args = program
  .description('Scaffolds a new rainier project')
  .usage('[output dir] [options]')
  .arguments('[dir]')
  .option('--js, --javascript', 'Scaffold project using javascript instead of typescript', false)
  .action((cmd) => {
    if (cmd) {
      outputDirectory = resolveOutDir(cmd);
    }
  })
  .parse(process.argv)
  .opts();

const { useJs, outDir } = {
  useJs: args.javascript,
  outDir: outputDirectory,
} as const;

const outDirIsCurrentDir = outDir === process.cwd();

if (!outDirIsCurrentDir && existsSync(outDir)) {
  throw new Error(`Can't create new rainier project in ${outDir}. Directory already exists`);
}

if (outDirIsCurrentDir && readdirSync(outDir).length !== 0) {
  throw new Error(`Can't create new rainier project in ${outDir}. Directory is not empty`);
}

const templates = getTemplates(useJs);
const baseExtension = useJs ? 'js' : 'ts';
const reactBaseExtension = `${baseExtension}x`;

if (!outDirIsCurrentDir) {
  mkdirSync(outDir);
}
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
writeFileSync(`${outDir}/src/stores/init/client.${baseExtension}`, templates.initClientStores);
writeFileSync(`${outDir}/src/stores/init/server.${baseExtension}`, templates.initServerStores);
writeFileSync(`${outDir}/src/controllers/manifest.${baseExtension}`, templates.controllerManifest);
writeFileSync(`${outDir}/src/components/app-shell.${reactBaseExtension}`, templates.appShell);
writeFileSync(`${outDir}/src/views/show-todos.${reactBaseExtension}`, templates.showTodos);
writeFileSync(`${outDir}/src/views/todoss.${reactBaseExtension}`, templates.todos);

console.info(chalk.green(`Rainier application successfully scaffolded in ${outDir}`));
