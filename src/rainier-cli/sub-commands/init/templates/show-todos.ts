export const showTodos = `import React from "react";
import { useTodoStore } from "rainier";

const TodoState = () => {
  const [todoState] = useTodoStore();

  return (
    <ul>
      {todoState.todos.map((todo, index) => {
        return <li key={index}>{todo}</li>;
      })}
    </ul>
  );
};

export default TodoState;
`;
