import express from "express";
import config from "@ninetales/config";
import log from "@ninetales/logger";
import registerRoutes from "./register-routes";

function prepare() {
  const app = express();

  // TODO: check for existence of a build

  app.use("/.assets", express.static(`./${config.buildDirs.client}`));
  app.use("/", express.static(`./${config.staticDir}`));

  return app;
}

export default function main() {
  const app = prepare();
  registerRoutes(app);

  app.listen(config.port, () => {
    log(`Listening on http://localhost:${config.port}`);
  });
}
