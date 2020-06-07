export const todoStoreJs = `import { Store } from "rainier";

export class TodoStore extends Store {
  static getDefaultState() {
    return {
      todos: [],
    };
  }

  async populateTodos() {
    this.state.todos.push("wake up");

    await this.sleep(2000);
    this.state.todos.push("take shower");
    await this.sleep(2000);

    this.state.todos.push("write code!");
  }

  sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
}
`;
