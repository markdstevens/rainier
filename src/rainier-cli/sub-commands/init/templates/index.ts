import { packageJsonJs, packageJsonTs } from './packageJson';
import { gitignore } from './gitignore';
import { tsconfig } from './tsconfigJson';
import { appShellJs, appShellTs } from './app-shell';
import { todoControllerJs, todoControllerTs } from './todo-controller';
import { controllerIndex } from './controller-index';
import { showTodosJs, showTodosTs } from './show-todos';
import { todoStoreJs, todoStoreTs } from './todo-store';
import { todoStoreIndex } from './todo-store-index';
import { initClientStoresJs, initClientStoresTs } from './init-client-stores';
import { initServerStores } from './init-server-stores';

interface TemplateFiles {
  packageJson: string;
  gitignore: string;
  tsconfig?: string;
  appShell: string;
  todoController: string;
  controllerIndex: string;
  showTodos: string;
  todoStore: string;
  todoStoreIndex: string;
  initClientStores: string;
  initServerStores: string;
}

const jsTemplates: TemplateFiles = {
  packageJson: packageJsonJs,
  gitignore,
  appShell: appShellJs,
  todoController: todoControllerJs,
  controllerIndex,
  showTodos: showTodosJs,
  todoStore: todoStoreJs,
  todoStoreIndex,
  initClientStores: initClientStoresJs,
  initServerStores: initServerStores,
};

const tsTemplates: TemplateFiles = {
  packageJson: packageJsonTs,
  gitignore,
  tsconfig,
  appShell: appShellTs,
  todoController: todoControllerTs,
  controllerIndex,
  showTodos: showTodosTs,
  todoStore: todoStoreTs,
  todoStoreIndex,
  initClientStores: initClientStoresTs,
  initServerStores: initServerStores,
};

const getTemplates = (isJs: boolean): TemplateFiles => (isJs ? jsTemplates : tsTemplates);

export default getTemplates;
