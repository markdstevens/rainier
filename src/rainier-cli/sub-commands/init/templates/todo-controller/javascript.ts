export const todoControllerJs = `import { loadable } from "rainier";

const TodoController = {
  basePath: "/todos",
  routes: [
    {
      paths: ["/"],
      View: loadable(() => import("views/todos")),
    },
    {
      paths: ["/show/:id"],
      View: loadable(() => import("views/show-todos")),
      async fetch(fetchOptions) {
        const todoStore = fetchOptions.stores.get('todoStore');
        await todoStore.populateTodos();
      },
    },
  ],
};

export default TodoController;
`;
