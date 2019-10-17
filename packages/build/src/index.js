import webpack from "webpack";
import nodeExternals from "webpack-node-externals";
import TerserJSPlugin from "terser-webpack-plugin";
import OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import recursive from "recursive-readdir";
import { remove, outputFile, copy } from "fs-extra";
import { resolve } from "path";

import config from "@ninetales/config";
import log from "@ninetales/logger";
import { promisify } from "es6-promisify";
import { renderFile } from "ejs";

const renderFileAsync = promisify(renderFile);
const webpackAsync = promisify(webpack);

// terminate the process if an error occurs
process.on("unhandledRejection", err => {
  throw err;
});

function createWebpackConfig(env, entries) {
  const { development, sourceFilePattern, buildDirs } = config;
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
          test: sourceFilePattern,
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

  if (config.transformWebpackConfig !== undefined) {
    config.transformWebpackConfig(webpackConfig);
  }

  return webpackConfig;
}

async function prepare() {
  // TODO: check for existence of a non-empty views folder + routes.js
  // TODO: check for reserved filenames: *.entry.js, views/routes

  await remove(config.outputDir);
}

async function prebuild() {
  const { sourceDir, buildDirs, sourceFilePattern } = config;
  const viewsDir = `${buildDirs.prebuild}/views`;
  const entries = {
    client: {},
    server: {
      routes: `./${buildDirs.prebuild}/routes.js`,
    },
  };

  await copy(sourceDir, buildDirs.prebuild);
  const ignore = file => !file.match(sourceFilePattern);

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

  const { entryFiles } = config;
  const webpackConfig = createWebpackConfig(env, entries);

  const stats = await webpackAsync(webpackConfig);
  console.log(stats.toString({ colors: true, excludeModules: true }));

  if (stats.hasErrors()) {
    log(`Failed to create ${env} build`, 2);
    process.exit(1);
  }

  const { entrypoints } = stats.toJson();
  await outputFile(entryFiles[env], JSON.stringify(entrypoints));

  log(`Successfully created ${env} build`);
}

export default async function main() {
  // check for expected files and remove existing output dir
  await prepare();

  // copy sources and create client entries
  const entries = await prebuild();

  // create client and server builds with Webpack
  await Promise.all(["client", "server"].map(env => build(env, entries)));
}
