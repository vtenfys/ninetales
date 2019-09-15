import { transformFileAsync } from "@babel/core";
import { promisify } from "es6-promisify";
import { renderFile } from "ejs";

import recursive from "recursive-readdir";
import { outputFile, copy } from "fs-extra";

// terminate the process if an error occurs
process.on("unhandledRejection", err => {
  throw err;
});

const renderFileAsync = promisify(renderFile);

export default async function main() {
  // TODO: move these to a global user-modifiable config
  const sourceDir = "src";
  const outputDir = "dist";
  const extensions = ["js", "jsx"];

  // TODO: check for existence of a non-empty views folder + routes.js

  const buildDirs = {
    server: `${outputDir}/server`,
    client: `${outputDir}/client`,
  };

  for (const file of await recursive(sourceDir)) {
    const outFile = `${buildDirs.server}/${file.slice(sourceDir.length + 1)}`;

    if (extensions.find(ext => file.endsWith(`.${ext}`))) {
      const { code } = await transformFileAsync(file, {
        presets: ["@ninetales/build"],
      });

      await outputFile(outFile, code);
    } else {
      await copy(file, outFile);
    }
  }

  // TODO: transform the entry files with Babel

  const viewsDir = `${buildDirs.server}/views`;
  const ignore = file => !file.endsWith(".js");

  for (const file of await recursive(viewsDir, [ignore])) {
    const outFile = file.replace(/\.js$/, ".entry.js");
    const viewImport = `./${file.slice(viewsDir.length + 1)}`;

    const code = await renderFileAsync(
      `${__dirname}/view-bundle.ejs`,
      { viewImport },
      { escape: string => JSON.stringify(string) }
    );

    await outputFile(outFile, code);
  }

  // TODO: create client bundle using Webpack
}
