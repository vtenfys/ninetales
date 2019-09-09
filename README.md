<img align="right" height="100" src="https://img.pokemondb.net/artwork/large/ninetales.jpg" alt="Ninetales" />

# Ninetales

Ninetales is a new way to create modern, server-based JavaScript websites and applications.

## Local Development

You can develop and test Ninetales locally using [Verdaccio](https://github.com/verdaccio/verdaccio). Note: the `verdaccio` package script requires `bash` to be installed, and hasn't been tested on Windows.

### Building and Publishing to Verdaccio

1. Install and start Verdaccio:

   ```sh
   yarn global add verdaccio
   verdaccio
   ```

2. In a new terminal, create a user and log in:

   ```sh
   npm adduser --registry http://localhost:4873
   ```

3. Finally, build all packages and publish them:

   ```sh
   cd <project root>
   yarn build
   yarn verdaccio
   ```

4. You can also build and/or publish a particular package with the following commands:

   ```sh
   cd packages/ninetales
   yarn build

   cd <project root>
   yarn verdaccio ninetales
   ```

### Installing from Verdaccio

You can install a package from Verdaccio in a project by specifying its registry URL on the command line. For example:

```sh
yarn add @ninetales/ninetales --registry http://localhost:4873
```

> Note: Ninetales package names are different to their directory names. For example, a package with the directory name `ninetales-foobar` will have the package name `@ninetales/foobar`. The exception to this is the `@ninetales/ninetales` package, whose directory name is just `ninetales`.

You can also configure Yarn to use the Verdaccio registry by default, instead of specifying it for each add/install command:

```sh
yarn config set registry http://localhost:4873
```

To revert back to the default registry, use `yarn config delete registry`.
