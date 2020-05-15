export {};
// import { program } from 'commander';
// import { writeFileSync, mkdirSync } from 'fs';
// import { packageJson } from './templates/package-json';
// import { todoController } from './templates/todo-controller';
// import { todoStore } from './templates/todo-store';
// import { todo } from './templates/todo';
// import { showTodos } from './templates/show-todos';

// const args = program
//   .option('--js', 'Scaffold project using javascript instead of typescript', false)
//   .parse(process.argv)
//   .opts();

// const options = {
//   useJavascript: args.js,
// } as const;

// const outDir = process.env.ORIGINAL_DIR || process.cwd();

// writeFileSync(`${outDir}/package.json`, packageJson);
// mkdirSync(`${outDir}/src`);
// mkdirSync(`${outDir}/src/controllers`);
// mkdirSync(`${outDir}/src/stores`);
// mkdirSync(`${outDir}/src/views`);
// writeFileSync(`${outDir}/src/controllers/todo-controller.js`, todoController);
// writeFileSync(`${outDir}/src/stores/todo-store.js`, todoStore);
// writeFileSync(`${outDir}/src/views/todo.jsx`, todo);
// writeFileSync(`${outDir}/src/views/show-todos.jsx`, showTodos);
