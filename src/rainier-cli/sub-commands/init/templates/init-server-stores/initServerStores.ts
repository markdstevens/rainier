export const initServerStores = `import { TodoStore } from "stores/todo-store";

export default () => {
  return {
    todoStore: new TodoStore(TodoStore.getDefaultState()),
  };
};
`;
