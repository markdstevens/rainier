export const showTodosJs = `import React from "react";
import { useStore, useObserver } from "rainier";

const TodoState = () => {
  const todoStore = useStore('todoStore');

  return useObserver(() => (
    <ul>
      {todoStore.todos.map((todo, index) => {
        return <li key={index}>{todo}</li>;
      })}
    </ul>
  ));
};

export default TodoState;
`;
