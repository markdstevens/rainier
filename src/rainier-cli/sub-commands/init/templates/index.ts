import { packageJsonJs, packageJsonTs } from './packageJson';
import { gitignore } from './gitignore';
import { tsconfig } from './tsconfigJson';
import { appShellJs, appShellTs } from './app-shell';
import { todoControllerJs, todoControllerTs } from './todo-controller';
import { controllerManifest } from './controller-manifest/index';
import { showTodosJs, showTodosTs } from './show-todos';
import { todoStoreJs, todoStoreTs } from './todo-store';
import { initClientStoresJs, initClientStoresTs } from './init-client-stores';
import { initServerStoresJs, initServerStoresTs } from './init-server-stores';
import { todosJs, todosTs } from './todos';

interface TemplateFiles {
  packageJson: string;
  gitignore: string;
  tsconfig?: string;
  appShell: string;
  todoController: string;
  controllerManifest: string;
  showTodos: string;
  todoStore: string;
  initClientStores: string;
  initServerStores: string;
  todos: string;
}

const jsTemplates: TemplateFiles = {
  packageJson: packageJsonJs,
  gitignore,
  appShell: appShellJs,
  todoController: todoControllerJs,
  controllerManifest,
  showTodos: showTodosJs,
  todoStore: todoStoreJs,
  initClientStores: initClientStoresJs,
  initServerStores: initServerStoresJs,
  todos: todosJs,
};

const tsTemplates: TemplateFiles = {
  packageJson: packageJsonTs,
  gitignore,
  tsconfig,
  appShell: appShellTs,
  todoController: todoControllerTs,
  controllerManifest,
  showTodos: showTodosTs,
  todoStore: todoStoreTs,
  initClientStores: initClientStoresTs,
  initServerStores: initServerStoresTs,
  todos: todosTs,
};

export const getTemplates = (isJs: boolean): TemplateFiles => (isJs ? jsTemplates : tsTemplates);
