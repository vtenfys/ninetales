const { writeFileSync } = require("fs");
const { execSync } = require("child_process");

const pkg = require(`${process.cwd()}/package.json`);
const devPkg = { ...pkg };

const REGISTRY = "http://localhost:4873/";

function writePackage(pkg) {
  writeFileSync("./package.json", JSON.stringify(pkg, null, 2) + "\n");
}

function updateDependencies(type) {
  if (pkg[type] === undefined) return;
  devPkg[type] = { ...pkg[type] };

  Object.keys(pkg[type]).forEach(name => {
    if (name.startsWith("@ninetales/")) {
      devPkg[type][name] += "-dev";
    }
  });
}

updateDependencies("dependencies");
updateDependencies("devDependencies");
updateDependencies("peerDependencies");

devPkg.version += `-dev.${Date.now()}`;
writePackage(devPkg);

process.on("SIGINT", () => {
  writePackage(pkg);
  process.exit(1);
});

let failed = false;
try {
  execSync(`npm publish --registry ${REGISTRY}`);
} catch (err) {
  failed = true;
}

writePackage(pkg);
if (failed) process.exit(1);
