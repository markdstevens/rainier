export const todoStoreTs = `import { Store } from "rainier";

export interface TodoStoreState {
  todos?: string[];
  populateTodos: () => Promise<void>;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function todoStore(): Store<TodoStoreState> {
  const todoStore = {
    todos: [],

    async populateTodos(this: TodoStoreState) {
      this.todos = this.todos ?? [];
      this.todos.push("wake up!");
      await sleep(2000);
      this.todos.push("drink coffee!");
      await sleep(2000);
      this.todos.push("start coding!");
    },
  };

  return todoStore;
}
`;
