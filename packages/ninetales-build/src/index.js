import * as babel from "@babel/core";

console.log(
  babel.transformFileSync(`${process.cwd()}/src/views/Page.js`, {
    configFile: `${__dirname}/build.config.js`,
  })
);
