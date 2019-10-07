import { outputFileSync, unlinkSync } from "fs-extra";
import { tmpdir } from "os";

import { transformSync } from "@babel/core";
import uuidv4 from "uuid/v4";

export default function evaluate({ code, base, babelOptions = {} }) {
  const requirerPath = require.resolve("./requirer");

  const outputCode = [
    `const requirer = require(${JSON.stringify(requirerPath)}).default;`,
    `require = requirer(${JSON.stringify({ base, babelOptions })});`,
    transformSync(code, babelOptions).code,
  ].join("\n");

  const outFile = `${tmpdir()}/module-eval/${uuidv4()}.js`;
  outputFileSync(outFile, outputCode);

  const result = require(outFile);
  unlinkSync(outFile);

  return result;
}

// e.g.
console.log(
  evaluate({
    code: [
      "import { myCenterConst } from './Page'",
      "export default `hello ${myCenterConst}`",
    ].join("\n"),
    base: "/Users/david/Code/Ninetales/ninetales-project/src/views",
    babelOptions: {
      presets: [`@ninetales/babel-preset/build/node`],
    },
  })
);
