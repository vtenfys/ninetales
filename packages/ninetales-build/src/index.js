import { transformAsync, transformFileAsync } from "@babel/core";
import { promisify } from "es6-promisify";
import { renderFile } from "ejs";

import recursive from "recursive-readdir";
import { remove, outputFile, copy } from "fs-extra";

// terminate the process if an error occurs
process.on("unhandledRejection", err => {
  throw err;
});

const renderFileAsync = promisify(renderFile);

async function prepare() {
  // TODO: move these to a global user-modifiable config
  const sourceDir = "src";
  const outputDir = "dist";
  const extensions = ["js", "jsx"];

  // TODO: check for existence of a non-empty views folder + routes.js

  await remove(outputDir);

  return { sourceDir, outputDir, extensions };
}

async function transformSources(sourceDir, buildDirs, extensions) {
  for (const file of await recursive(sourceDir)) {
    const outFile = `${buildDirs.server}/${file.slice(sourceDir.length + 1)}`;

    if (extensions.find(ext => file.endsWith(`.${ext}`))) {
      const { code } = await transformFileAsync(file, {
        presets: ["@ninetales/babel-preset/server"],
      });

      await outputFile(outFile, code);
    } else {
      await copy(file, outFile);
    }
  }
}

async function createViewEntries(buildDirs) {
  const viewsDir = `${buildDirs.server}/views`;
  const ignore = file => !file.endsWith(".js");

  for (const file of await recursive(viewsDir, [ignore])) {
    const outFile = file.replace(/\.js$/, ".entry.js");
    const viewImport = `./${file.slice(viewsDir.length + 1)}`;

    const { code } = await transformAsync(
      await renderFileAsync(
        `${__dirname}/view-entry.ejs`,
        { viewImport },
        { escape: string => JSON.stringify(string) }
      ),
      {
        presets: ["@ninetales/babel-preset/server"],
      }
    );

    await outputFile(outFile, code);
  }
}

export default async function main() {
  const { sourceDir, outputDir, extensions } = await prepare();

  const buildDirs = {
    server: `${outputDir}/server`,
    client: `${outputDir}/client`,
  };

  await transformSources(sourceDir, buildDirs, extensions);
  await createViewEntries(buildDirs);

  // TODO: create client bundle using Webpack
}
