import { existsSync } from "fs";

const config = {
  sourceDir: "src",
  outputDir: "dist",
  staticDir: "static",
  sourceExtensions: ["js", "jsx"],
  development: process.env.NODE_ENV === "development",
  transformWebpackConfig: undefined,
  port: 3000,
};

if (existsSync("ninetales.config.js")) {
  const userConfig = require(`${process.cwd()}/ninetales.config`);

  // only allow specific properties to be overridden
  for (const property of [
    "sourceDir",
    "outputDir",
    "staticDir",
    "sourceExtensions",
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
  server: `${config.outputDir}/server`,
  client: `${config.outputDir}/client`,
};

export default config;
