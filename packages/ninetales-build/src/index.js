import { transformFileAsync } from "@babel/core";
import recursive from "recursive-readdir";
import { outputFile, copy } from "fs-extra";

export default async function main() {
  // TODO: move these to a global user-modifiable config
  const sourceDir = "src";
  const outputDir = "dist";
  const extensions = ["js", "jsx"];

  for (const file of await recursive(sourceDir)) {
    const outFile = outputDir + file.slice(sourceDir.length);

    if (extensions.find(ext => file.endsWith(`.${ext}`))) {
      const { code } = await transformFileAsync(file, {
        presets: ["@ninetales/build"],
      });

      await outputFile(outFile, code);
    } else {
      await copy(file, outFile);
    }
  }
}
