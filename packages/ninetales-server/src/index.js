import express from "express";
import renderResponse from "./render-response";
import config from "./config.json"; // TODO: make this a separate package
const entrypoints = require(`${process.cwd()}/dist/server/entrypoints.json`);

function prepare() {
  const app = express();

  // TODO: check for existence of a build

  app.use("/.bundles", express.static("./dist/client"));
  // TODO: use React to render full HTML rather than EJS
  app.set("view engine", "ejs");
  app.set("views", `${__dirname}/views`);

  app.get("/.data/*", (req, res, next) => {
    res.locals.type = "data";
    req.url = req.path.replace(/^\/\.data/, "");
    next();
  });

  return app;
}

function registerRoutes(app) {
  // TODO: get "dist" directory name from global config rather than hardcoding

  const routes = require(`${process.cwd()}/dist/server/routes`).default;
  routes.forEach(({ path, view }) => {
    app.get(path, async (req, res) => {
      const component = `${process.cwd()}/dist/server/views/${view}`;

      if (process.env.NODE_ENV === "development") {
        delete require.cache[require.resolve(component)];
      }

      const { default: View, getData } = require(component);
      const { assets: bundles } = entrypoints[view];

      renderResponse(res, View, bundles, {
        type: res.locals.type || "full",
        data: await getData(),
      });
    });
  });
}

export default function main() {
  const app = prepare();
  registerRoutes(app);

  app.listen(config.port, () => {
    console.log(`Listening on http://localhost:${config.port}`);
  });
}
