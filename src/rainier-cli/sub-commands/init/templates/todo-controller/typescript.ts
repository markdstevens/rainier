export const todoControllerTs = `import { loadable, Controller, FetchOptions } from "rainier";
import { TodoStore } from "stores/todo-store";

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
        const todoStore = fetchOptions.stores.get(TodoStore);
        await todoStore.populateTodos();
      },
    },
  ],
};

export default TodoController;
`;
