export const todoControllerTs = `import { loadable, Controller, FetchOptions } from "rainier";
import { TodoStoreState } from "stores/todo-store";

const TodoController: Controller = {
  basePath: "/todos",
  routes: [
    {
      paths: ["/"],
      View: loadable(() => import("views/todos")),
    },
    {
      paths: ["/show/:id"],
      View: loadable(() => import("views/show-todos")),
      async fetch(fetchOptions: FetchOptions) {
        const todoStore = fetchOptions.stores.get<TodoStoreState>('todoStore');
        await todoStore.populateTodos();
      },
    },
  ],
};

export default TodoController;
`;
