export const todoStoreTs = `import { Store } from "rainier";

export interface TodoStoreState {
  todos?: string[];
}

export class TodoStore extends Store<TodoStoreState> {
  static getDefaultState() {
    return {
      todos: [],
    };
  }

  async populateTodos() {
    this.state.todos?.push("wake up");

    await this.sleep(2000);
    this.state.todos?.push("take shower");
    await this.sleep(2000);

    this.state.todos?.push("write code!");
  }

  sleep(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
}
`;
