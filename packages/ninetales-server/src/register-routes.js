import renderResponse from "./render-response";
const entrypoints = `${process.cwd()}/dist/server/entrypoints.json`;

function registerRoutes(app) {
  // TODO: get "dist" directory name from global config rather than hardcoding

  const routes = require(`${process.cwd()}/dist/server/routes`).default;
  routes.forEach(({ path, view }) => {
    app.get(path, async (req, res) => {
      const component = `${process.cwd()}/dist/server/views/${view}`;

      if (process.env.NODE_ENV === "development") {
        delete require.cache[require.resolve(component)];
        delete require.cache[require.resolve(entrypoints)];
      }

      const { default: View, getData } = require(component);
      const { assets: bundles } = require(entrypoints)[view];

      renderResponse(res, {
        View,
        bundles,
        minimal: res.locals.minimal,
        data: await getData(req),
      });
    });
  });
}

export default registerRoutes;
