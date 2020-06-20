export const showTodosTs = `import React from "react";
import { useStore, useObserver } from "rainier";
import { TodoStoreState } from "stores/todo-store";

const ShowTodos: React.FC = () => {
  const todoStore = useStore<TodoStoreState>('todoStore');

  return useObserver(() => (
    <ul>
      {todoStore.todos?.map((todo, index) => {
        return <li key={index}>{todo}</li>;
      })}
    </ul>
  ));
};

export default ShowTodos;
`;
