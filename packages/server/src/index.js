import express from "express";
import config from "./config.json"; // TODO: use global config
import registerRoutes from "./register-routes";

function prepare() {
  const app = express();

  // TODO: check for existence of a build
  // TODO: get directory name from global config

  app.use("/.assets", express.static("./dist/client"));
  app.use("/", express.static("./static"));

  return app;
}

export default function main() {
  const app = prepare();
  registerRoutes(app);

  app.listen(config.port, () => {
    console.log(`Listening on http://localhost:${config.port}`);
  });
}
