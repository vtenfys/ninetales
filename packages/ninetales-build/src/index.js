import * as babel from "@babel/core";
import recursive from "recursive-readdir";

export default async function main() {
  for (const file of await recursive("src")) {
    const { code } = await babel.transformAsync(file, {
      presets: ["@ninetales/build"],
    });

    console.log(code);
  }
}

// TODO: remove function name and call from CLI
main();
