import { packageJsonJs, packageJsonTs } from './packageJson';
import { gitignore } from './gitignore';
import { tsconfig } from './tsconfigJson';
import { appShellJs, appShellTs } from './app-shell';
import { todoControllerJs, todoControllerTs } from './todo-controller';
import { controllerManifest } from './controller-manifest/index';
import { showTodosJs, showTodosTs } from './show-todos';
import { todoStoreJs, todoStoreTs } from './todo-store';
import { todoStoreIndex } from './todo-store-index/index';
import { initClientStoresJs, initClientStoresTs } from './init-client-stores';
import { initServerStores } from './init-server-stores';
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
  todoStoreIndex: string;
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
  todoStoreIndex,
  initClientStores: initClientStoresJs,
  initServerStores: initServerStores,
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
  todoStoreIndex,
  initClientStores: initClientStoresTs,
  initServerStores: initServerStores,
  todos: todosTs,
};

export const getTemplates = (isJs: boolean): TemplateFiles => (isJs ? jsTemplates : tsTemplates);
