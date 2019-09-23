#!/usr/bin/env node
import yargs from "yargs";

// TODO: only catch require errors, not everything else

yargs.command("build", "build a project", () => {}, function() {
  try {
    require("@ninetales/build").default();
  } catch (e) {
    console.error("Error: command 'build' must be used inside a project");
    process.exit(1);
  }
});

yargs.command("serve", "serve a built project", () => {}, function() {
  try {
    require("@ninetales/server").default();
  } catch (e) {
    console.log("Error: command 'serve' must be used inside a project");
    process.exit(1);
  }
});

yargs.argv;
