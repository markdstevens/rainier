export const packageJsonTs = `{
  "name": "todo-app",
  "version": "1.0.0",
  "description": "An app built with rainier!",
  "main": "./dist/server.js",
  "scripts": {
    "clean": "rimraf dist",
    "build": "npm run clean && npm rainier build"
  },
  "keywords": [
    "rainier"
  ],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "rainier": "0.x.x",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-router-dom": "^5.2.0"
  },
  "devDependencies": {
    "@types/react": "^16.9.35",
    "@types/react-router-dom": "^5.1.5",
    "rimraf": "^3.0.2"
  }
}
`;
