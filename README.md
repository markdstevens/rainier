# 🚠 Rainier

[![Rainier build](https://circleci.com/gh/markdstevens/rainier/tree/master.svg?style=shield)](https://circleci.com/gh/markdstevens/rainier)
[![Rainier version](https://img.shields.io/github/package-json/v/markdstevens/rainier)]()
[![Licence](https://img.shields.io/github/license/markdstevens/rainier)](https://github.com/markdstevens/rainier/blob/master/LICENSE)
[![Typescript version](https://img.shields.io/github/package-json/dependency-version/markdstevens/rainier/typescript)]()

Rainier is a lightweight javascript framework for building isomorphic react applications. It's sole purpose is to allow developers to focus on writing application code rather than spending endless hours writing configurations for webpack, server-side rendering, babel, typsescript, etc. Out of the box, rainier supports:

✅ Typescript <br />
✅ React <br />
✅ Server side rendering <br />
✅ Route-based code splitting with webpack <br />
✅ Declarative API for creating routes <br />
✅ Out of the box asset precaching and app-shell architecture with service workers <br />

Rainier is **not** an oppionated, monolith framework that forces you to use a particular css framework, test framework, etc. You don't even have to use typescript if you don't want to; Rainier supports vanilla javascript as well.

## Getting Started

### Creating new rainier project

To get started, create a new rainier project using rainier's CLI:

```
$ npx rainier init todo-app
$ cd todo-app
```

#### Installing and running

After the rainier project has been scaffolded, install the dependencies and start the development server with npm:

```
$ npm i
$ npm run build
```
