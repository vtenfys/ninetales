import express from "express";
import config from "./config.json"; // TODO: make this a separate package
import registerRoutes from "./register-routes";

function prepare() {
  const app = express();

  // TODO: check for existence of a build
  app.use("/.bundles", express.static("./dist/client"));

  return app;
}

export default function main() {
  const app = prepare();
  registerRoutes(app);

  app.listen(config.port, () => {
    console.log(`Listening on http://localhost:${config.port}`);
  });
}
