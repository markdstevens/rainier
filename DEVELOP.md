## Testing

Once development is complete, you may want to test your changes by installing your locally developed package and running it organically in another project. Let's say you've made a change in the `packages/rainier-cli` package. You also have another project where you want to test `rainier-cli`, and we'll call that project `test-project`.

Let's say your files look like this:

```
/rainier
  /packages
    /rainier-cli
/side-project
  /package.json
```

To test locally, you can do this:

```
$ cd rainier
$ yarn compile
$ cd ../side-project
$ yarn add file:../rainier/packages/rainier-cli
```

Now, all binaries and exports included in `rainier-cli` with be available for consuption in `test-project`. To test this out, edit `/side-project/package.json` like so:

```
"scripts": {
  "build": "rainier webpack"
}
```

Then execute:

```
$ yarn build
```
