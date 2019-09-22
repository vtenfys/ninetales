#!/usr/bin/env node
import yargs from "yargs";

// TODO: only catch require errors, not everything else

yargs
  .command(
    "build",
    "build a project",
    () => {},
    () => {
      try {
        require("@ninetales/build").default();
      } catch (e) {
        console.error("Error: command 'build' must be used inside a project");
        process.exit(1);
      }
    }
  )
  .command(
    "serve",
    "serve a built project",
    () => {},
    () => {
      try {
        require("@ninetales/server").default();
      } catch (e) {
        console.log("Error: command 'serve' must be used inside a project");
        process.exit(1);
      }
    }
  ).argv;
