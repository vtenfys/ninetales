import express from "express";
import renderResponse from "./render-response";
import config from "./config.json"; // TODO: make this a separate package
const entrypoints = require(`${process.cwd()}/dist/server/entrypoints.json`);

const app = express();

// TODO: get "src", "dist" directory names from global config rather than
// hardcoding

// TODO: use React to render full HTML rather than EJS
app.use("/.bundles", express.static("./dist/client"));
app.set("view engine", "ejs");
app.set("views", `${__dirname}/views`);

app.get("/.data/*", (req, res, next) => {
  res.locals.type = "data";
  req.url = req.path.replace(/^\/\.data/, "");
  next();
});

// register user-defined routes
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

export default app;

// TODO: move to CLI
app.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`);
});
