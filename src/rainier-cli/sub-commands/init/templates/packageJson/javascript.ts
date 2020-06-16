export const packageJsonJs = `{
  "name": "todo-app",
  "version": "1.0.0",
  "description": "An app built with rainier!",
  "main": "./dist/server.js",
  "scripts": {
    "clean": "rimraf dist",
    "build": "npm run clean && rainier build"
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
    "rimraf": "^3.0.2"
  }
}
`;
