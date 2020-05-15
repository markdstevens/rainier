export const todoController = `import {
  Controller,
  baseRoute,
  loadable,
  view,
  route,
  staticRoute,
  staticView,
} from "rainier";

@baseRoute("/todos")
export class TodoController extends Controller {
  @staticRoute("/")
  @staticView(loadable(() => import("../views/todo")))
  todo;

  @route("/show")
  @view(loadable(() => import("../views/show-todos")))
  async showTodos({ stores }) {
    const todoStore = stores.get("todoStore");

    await todoStore.populateTodos();
  }
}
`;
