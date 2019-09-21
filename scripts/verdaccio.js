const { writeFileSync } = require("fs");
const { execSync } = require("child_process");

const packagejson = require(`${process.cwd()}/package.json`);
const REGISTRY = "http://localhost:4873/";

function writePackageJSON(packageJSON) {
  writeFileSync("./package.json", JSON.stringify(packageJSON, null, 2) + "\n");
}

writePackageJSON({
  ...packagejson,
  version: `${packagejson.version}-dev.${Date.now()}`,
});

let failed = false;

try {
  execSync(`npm publish --registry ${REGISTRY}`);
} catch (err) {
  failed = true;
} finally {
  writePackageJSON(packagejson);
  if (failed) process.exit(1);
}
