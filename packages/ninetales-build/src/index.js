import { transformFileAsync } from "@babel/core";
import { promisify } from "es6-promisify";
import webpack from "webpack";
import { renderFile } from "ejs";

import recursive from "recursive-readdir";
import { remove, outputFile, copy } from "fs-extra";
import { resolve } from "path";

const renderFileAsync = promisify(renderFile);
const webpackAsync = promisify(webpack);

// terminate the process if an error occurs
process.on("unhandledRejection", err => {
  throw err;
});

async function prepare() {
  // TODO: move these to a global user-modifiable config
  const sourceDir = "src";
  const outputDir = "dist";
  const extensions = ["js", "jsx"];

  const buildDirs = {
    prebuild: `${outputDir}/client-prebuild`,
    server: `${outputDir}/server`,
    client: `${outputDir}/client`,
  };

  // TODO: check for existence of a non-empty views folder + routes.js
  // TODO: check for reserved filenames: entrypoints.json, *.entry.js

  await remove(outputDir);

  return { sourceDir, buildDirs, extensions };
}

async function serverBuild(sourceDir, serverDir, extensions) {
  for (const file of await recursive(sourceDir)) {
    const outFile = serverDir + file.slice(sourceDir.length);

    if (extensions.find(ext => file.endsWith(`.${ext}`))) {
      const { code } = await transformFileAsync(file, {
        presets: [`@ninetales/babel-preset/build/node`],
      });

      await outputFile(outFile, code);
    } else {
      await copy(file, outFile);
    }
  }
}

async function clientPrebuild(sourceDir, prebuildDir, extensions) {
  await copy(sourceDir, prebuildDir);

  const viewsDir = `${prebuildDir}/views`;
  const entries = [];
  const ignore = file => !extensions.find(ext => file.endsWith(`.${ext}`));

  for (const file of await recursive(viewsDir, [ignore])) {
    const viewName = file.replace(/\.([^.]+)?$/, "").slice(viewsDir.length + 1);
    const outFile = `${viewsDir}/${viewName}.entry.js`;
    const viewImport = `./${viewName}`;

    const code = await renderFileAsync(
      `${__dirname}/view-entry.ejs`,
      { viewImport },
      { escape: string => JSON.stringify(string) }
    );

    await outputFile(outFile, code);
    entries.push([viewName, outFile]);
  }

  return entries;
}

async function createClientBundles(clientDir, serverDir, entries, extensions) {
  const webpackEntry = {};
  entries.forEach(([view, entry]) => {
    webpackEntry[view] = `./${entry}`;
  });

  // TODO: allow configuring Webpack build options
  const config = {
    mode: process.env.NODE_ENV || "production", // TODO: move to global config
    entry: webpackEntry,
    output: {
      filename: "[chunkhash].bundle.js",
      path: resolve(clientDir),
    },
    resolve: {
      // TODO: integrate with config
      alias: {
        react: "preact/compat",
      },
    },
    optimization: {
      usedExports: true,
      splitChunks: {
        chunks: "all",
      },
    },
    module: {
      rules: [
        {
          test: file => extensions.find(ext => file.endsWith(`.${ext}`)),
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@ninetales/babel-preset/build/browser"],
            },
          },
        },
      ],
    },
  };

  const stats = await webpackAsync(config);

  if (stats.hasWarnings()) {
    stats.warnings.forEach(warning => console.warn(warning));
  }
  if (stats.hasErrors()) {
    stats.errors.forEach(error => console.error(error));
    process.exit(1);
  }

  console.log(stats.toString({ colors: true, excludeModules: true }));
  const { entrypoints } = stats.toJson();

  await outputFile(
    `${serverDir}/entrypoints.json`,
    JSON.stringify(entrypoints)
  );
}

export default async function main() {
  const { sourceDir, buildDirs, extensions } = await prepare();

  // server build
  await serverBuild(sourceDir, buildDirs.server, extensions);

  // client prebuild: copy sources and create view entries
  const entries = await clientPrebuild(
    sourceDir,
    buildDirs.prebuild,
    extensions
  );

  // create client bundles with Webpack + Babel
  await createClientBundles(
    buildDirs.client,
    buildDirs.server,
    entries,
    extensions
  );

  // delete client prebuild
  await remove(buildDirs.prebuild);
}
