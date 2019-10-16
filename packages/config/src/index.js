import { existsSync } from "fs";

const config = {
  sourceDir: "src",
  outputDir: "dist",
  staticDir: "static",
  sourceFilePattern: /\.jsx?$/,
  development: process.env.NODE_ENV === "development",
  transformWebpackConfig: undefined,
  port: 3000,
};

const userConfigFile = "ninetales.config.js";
if (existsSync(userConfigFile)) {
  const userConfig = require(`${process.cwd()}/${userConfigFile}`);

  // only allow specific properties to be overridden
  for (const property of [
    "sourceDir",
    "outputDir",
    "staticDir",
    "sourceFilePattern",
    "transformWebpackConfig",
    "port",
  ]) {
    if (userConfig[property] !== undefined) {
      config[property] = userConfig[property];
    }
  }
}

config.buildDirs = {
  prebuild: `${config.outputDir}/prebuild`,
  client: `${config.outputDir}/client`,
  server: `${config.outputDir}/server`,
};

config.entryFiles = {
  client: `${config.buildDirs.server}/entrypoints.client.json`,
  server: `${config.buildDirs.server}/entrypoints.server.json`,
};

export default config;
