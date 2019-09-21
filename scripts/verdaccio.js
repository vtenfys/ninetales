const { writeFileSync } = require("fs");
const { execSync } = require("child_process");

const pkg = require(`${process.cwd()}/package.json`);
const devPkg = { ...pkg };

const REGISTRY = "http://localhost:4873/";

function writePackage(pkg) {
  writeFileSync("./package.json", JSON.stringify(pkg, null, 2) + "\n");
}

devPkg.dependencies = { ...pkg.dependencies };
Object.keys(pkg.dependencies).forEach(name => {
  if (name.startsWith("@ninetales/")) {
    devPkg.dependencies[name] = "latest";
  }
});

devPkg.version += `-dev.${Date.now()}`;
writePackage(devPkg);

let failed = false;
try {
  execSync(`npm publish --registry ${REGISTRY}`);
} catch (err) {
  failed = true;
} finally {
  writePackage(pkg);
  if (failed) process.exit(1);
}
