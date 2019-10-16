import config from "@ninetales/config";
import renderResponse from "./render-response";

const buildDirs = {
  client: `${process.cwd()}/${config.buildDirs.client}`,
  server: `${process.cwd()}/${config.buildDirs.server}`,
};

const entrypoints = {
  client: require(`${buildDirs.server}/entrypoints.client.json`),
  server: require(`${buildDirs.server}/entrypoints.server.json`),
};

// TODO: support building while server running (i.e. delete module cache)

function registerRoutes(app) {
  const routesEntry = entrypoints.server.routes.assets[0];
  const routes = require(`${buildDirs.server}/${routesEntry}`).default;

  routes.forEach(({ path, view }) => {
    app.get(path, async (req, res) => {
      const serverEntry = entrypoints.server[view].assets[0];
      const component = `${buildDirs.server}/${serverEntry}`;

      const { default: View, getData } = require(component);
      const { assets } = entrypoints.client[view];

      renderResponse(res, {
        View,
        assets,
        data: await getData(req),
      });
    });
  });
}

export default registerRoutes;
