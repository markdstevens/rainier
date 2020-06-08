export const initClientStoresTs = `import { TodoStore } from "stores/todo-store";
import { StoreMap } from "rainier";

export default (serializedStores: StoreMap) => {
  return {
    todoStore: new TodoStore(
      serializedStores.todoStore.state,
      TodoStore.getDefaultState()
    ),
  };
};
`;
