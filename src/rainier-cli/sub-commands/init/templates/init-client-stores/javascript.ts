export const initClientStoresJs = `import { TodoStore } from "../todo-store";

export default (serializedStores) => {
  return {
    todoStore: new TodoStore(
      serializedStores.todoStore.state,
      TodoStore.getDefaultState()
    ),
  };
};
`;
