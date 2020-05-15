export const todoStore = `import { BaseStore } from "rainier";

export class TodoStore extends BaseStore {
  async populateTodos() {
    this.state.todos = [];
    this.state.todos.push("wake up");
    this.state.todos.push("drink coffee");

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
