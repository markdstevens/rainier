export const showTodosTs = `import React from "react";
import { useStore } from "rainier";
import { TodoStore } from "stores/todo-store";

const ShowTodos: React.FC = () => {
  const todoStore = useStore(TodoStore);

  return (
    <ul>
      {todoStore.state.todos?.map((todo, index) => {
        return <li key={index}>{todo}</li>;
      })}
    </ul>
  );
};

export default ShowTodos;
`;
