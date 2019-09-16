import { transformFileAsync } from "@babel/core";
import { promisify } from "es6-promisify";
import { renderFile } from "ejs";

import recursive from "recursive-readdir";
import { remove, outputFile, copy } from "fs-extra";

const renderFileAsync = promisify(renderFile);

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

  await remove(outputDir);

  return { sourceDir, buildDirs, extensions };
}

async function build(sourceDir, serverDir, preset, extensions) {
  for (const file of await recursive(sourceDir)) {
    const outFile = serverDir + file.slice(sourceDir.length);

    if (extensions.find(ext => file.endsWith(`.${ext}`))) {
      const { code } = await transformFileAsync(file, {
        presets: [`@ninetales/babel-preset/build/${preset}`],
      });

      await outputFile(outFile, code);
    } else {
      await copy(file, outFile);
    }
  }
}

async function createViewEntries(prebuildDir, extensions) {
  const viewsDir = `${prebuildDir}/views`;
  const ignore = file => !extensions.find(ext => file.endsWith(`.${ext}`));

  for (const file of await recursive(viewsDir, [ignore])) {
    const fileWithoutExtension = file.replace(/\.([^.]+)?$/, "");
    const outFile = `${fileWithoutExtension}.entry.js`;
    const viewImport = "." + fileWithoutExtension.slice(viewsDir.length);

    const code = await renderFileAsync(
      `${__dirname}/view-entry.ejs`,
      { viewImport },
      { escape: string => JSON.stringify(string) }
    );

    await outputFile(outFile, code);
  }
}

export default async function main() {
  const { sourceDir, buildDirs, extensions } = await prepare();

  // server build
  await build(sourceDir, buildDirs.server, "node", extensions);

  // client prebuild
  await build(sourceDir, buildDirs.prebuild, "browser", extensions);

  // create view entries
  await createViewEntries(buildDirs.prebuild, extensions);

  // TODO: create client bundle using Webpack
}
