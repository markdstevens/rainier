export const packageJson = `{
  "name": "test-rainier",
  "version": "1.0.0",
  "description": "An app built with rainier!",
  "main": "./dist/server.js",
  "scripts": {
    "clean": "rimraf dist",
    "build": "yarn rainier webpack"
  },
  "keywords": [
    "rainier",
    "react"
  ],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "rainier": "^0.0.1",
    "react": "^16.13.1",
    "react-dom": "^16.13.1",
    "react-router-dom": "^5.2.0"
  },
  "devDependencies": {
    "rimraf": "^3.0.2"
  }
}
`;
