<img align="right" height="120" src="https://img.pokemondb.net/artwork/large/ninetales.jpg" alt="Ninetales" />

# Ninetales

Ninetales is two things:

1. a new way to create modern JavaScript websites and applications

2. an experimental project designed to push the bounds of what's possible with existing frameworks

## Developing Ninetales

You can develop and test Ninetales locally using [Verdaccio](https://github.com/verdaccio/verdaccio).

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

4. You can also build and/or publish a particular package by running the same commands inside its directory:

   ```sh
   cd packages/ninetales
   yarn build
   yarn verdaccio
   ```

### Installing from Verdaccio

You can install a package from Verdaccio in a project by specifying its registry URL on the command line. For example:

```sh
yarn add @ninetales/ninetales --registry http://localhost:4873
```

You can also configure Yarn to use the Verdaccio registry by default, instead of specifying it for each add/install command:

```sh
yarn config set registry http://localhost:4873
```

To revert back to the default registry, use `yarn config delete registry`.
