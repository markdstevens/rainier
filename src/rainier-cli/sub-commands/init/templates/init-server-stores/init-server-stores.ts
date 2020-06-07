export const initServerStores = `import { TodoStore } from "../todo-store";

export default () => {
  return {
    todoStore: new TodoStore(TodoStore.getDefaultState()),
  };
};
`;
