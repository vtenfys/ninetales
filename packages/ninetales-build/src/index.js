import { transformFileSync } from "@babel/core";

console.log(transformFileSync(`${process.cwd()}/src/views/Page.js`), {
  presets: [require("@ninetales/build-preset")],
});
