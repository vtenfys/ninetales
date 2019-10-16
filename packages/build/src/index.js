import webpack from "webpack";
import nodeExternals from "webpack-node-externals";
import TerserJSPlugin from "terser-webpack-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import recursive from "recursive-readdir";
import { remove, outputFile, copy } from "fs-extra";
import { resolve } from "path";

import { promisify } from "es6-promisify";
import { renderFile } from "ejs";
import { fileHasExtension, log } from "./utils";

const renderFileAsync = promisify(renderFile);
const webpackAsync = promisify(webpack);

// terminate the process if an error occurs
process.on("unhandledRejection", err => {
  throw err;
});

// TODO: allow user modification
// TODO: output to file that the server can read

const config = {
  sourceDir: "src",
  outputDir: "dist",
  staticDir: "static",
  sourceExtensions: ["js", "jsx"],
  development: process.env.NODE_ENV === "development",
};

config.buildDirs = {
  prebuild: `${config.outputDir}/prebuild`,
  server: `${config.outputDir}/server`,
  client: `${config.outputDir}/client`,
};

function createWebpackConfig(env, entries) {
  const { development, sourceExtensions, buildDirs } = config;
  const preset = { client: "browser", server: "node" }[env];

  const webpackConfig = {
    mode: development ? "development" : "production",
    entry: entries[env],
    output: {
      filename: "[chunkhash].js",
      path: resolve(buildDirs[env]),
    },
    optimization: {
      minimizer: [new TerserJSPlugin(), new OptimizeCSSAssetsPlugin()],
      usedExports: true,
      splitChunks: {
        chunks: "all",
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[contenthash].css",
      }),
    ],
    module: {
      rules: [
        {
          test: file => file.endsWith(".css"),
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: development,
              },
            },
            "css-loader",
          ],
        },
        {
          test: file => fileHasExtension(file, sourceExtensions),
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [`@ninetales/babel-preset/build/${preset}`],
            },
          },
        },
      ],
    },
  };

  if (env === "client") {
    webpackConfig.output.publicPath = "/.assets/";
  }

  if (env === "server") {
    webpackConfig.target = "node";
    webpackConfig.output.libraryTarget = "commonjs2";
    webpackConfig.externals = [nodeExternals()];
  }

  return webpackConfig;
}

async function prepare() {
  // TODO: check for existence of a non-empty views folder + routes.js
  // TODO: check for reserved filenames: *.entry.js, views/routes

  await remove(config.outputDir);
}

async function prebuild() {
  const { sourceDir, buildDirs, sourceExtensions } = config;
  const viewsDir = `${buildDirs.prebuild}/views`;
  const entries = {
    client: {},
    server: {
      routes: `./${buildDirs.prebuild}/routes.js`,
    },
  };

  await copy(sourceDir, buildDirs.prebuild);
  const ignore = file => !fileHasExtension(file, sourceExtensions);

  for (const file of await recursive(viewsDir, [ignore])) {
    const relativeFile = file.slice(viewsDir.length + 1);
    const viewName = relativeFile.replace(/\.([^.]+)?$/, "");
    const viewImport = `./${viewName}`;

    const serverFile = `${viewsDir}/${relativeFile}`;
    const clientFile = `${viewsDir}/${viewName}.entry.js`;

    await outputFile(
      clientFile,
      await renderFileAsync(
        `${__dirname}/templates/view-entry.ejs`,
        { viewImport },
        { escape: string => JSON.stringify(string) }
      )
    );

    entries.client[viewName] = `./${clientFile}`;
    entries.server[viewName] = `./${serverFile}`;
  }

  return entries;
}

async function build(env, entries) {
  log(`Creating ${env} build...`);

  const { buildDirs } = config;
  const webpackConfig = createWebpackConfig(env, entries);

  const stats = await webpackAsync(webpackConfig);
  log(stats.toString({ colors: true, excludeModules: true }), "webpack");

  if (stats.hasErrors()) {
    process.exit(1);
  }

  const { entrypoints } = stats.toJson();
  await outputFile(
    `${buildDirs.server}/entrypoints.${env}.json`,
    JSON.stringify(entrypoints)
  );

  log(`Successfully created ${env} build!`);
}

export default async function main() {
  // check for expected files and remove existing output dir
  await prepare();

  // copy sources and create client entries
  const entries = await prebuild();

  // create client and server builds with Webpack
  await Promise.all(["client", "server"].map(env => build(env, entries)));
}
