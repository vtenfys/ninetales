import * as babel from "@babel/core";

const { code } = babel.transformFileSync(`${process.cwd()}/src/views/Page.js`, {
  presets: ["@ninetales/build"],
  configFile: false,
});

console.log(code);
