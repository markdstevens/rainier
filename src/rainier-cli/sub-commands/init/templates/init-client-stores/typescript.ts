export const initClientStoresTs = `import { todoStore } from "stores/todo-store";
import { Store } from "rainier";

export default (): Store => {
  return {
    todoStore: todoStore(),
  };
};

`;
