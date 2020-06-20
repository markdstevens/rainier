export const initServerStoresJs = `import { todoStore } from "stores/todo-store";

export default () => {
  return {
    todoStore: todoStore(),
  };
};
`;
