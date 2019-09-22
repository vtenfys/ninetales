import renderResponse from "./render-response";
const entrypoints = require(`${process.cwd()}/dist/server/entrypoints.json`);

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

      renderResponse(res, {
        View,
        bundles,
        full: !res.locals.minimal,
        data: await getData(req),
      });
    });
  });
}

export default registerRoutes;
