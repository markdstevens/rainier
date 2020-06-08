export const todoControllerJs = `import { loadable } from "rainier";
import { TodoStore } from "stores/todo-store";

const TodoController = {
  basePath: "/todos",
  routes: [
    {
      paths: ["/show/:id"],
      View: loadable(() => import("views/show-todos")),
      async method(fetchOptions) {
        const todoStore = fetchOptions.stores.get(TodoStore);
        await todoStore.populateTodos();
      },
    },
  ],
};

export default TodoController;
`;
