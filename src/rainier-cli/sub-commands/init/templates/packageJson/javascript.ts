export const packageJsonJs = `{
  "name": "test-rainier",
  "version": "1.0.0",
  "description": "An app built with rainier!",
  "main": "./dist/server.js",
  "scripts": {
    "clean": "rimraf dist",
    "build": "yarn clean && yarn rainier build"
  },
  "keywords": [
    "rainier"
  ],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "rainier": "file:../../rainier",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-router-dom": "^5.2.0"
  },
  "devDependencies": {
    "rimraf": "^3.0.2"
  }
}
`;
