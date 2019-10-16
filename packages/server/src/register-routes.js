import config from "@ninetales/config";
import renderResponse from "./render-response";

const serverDir = `${process.cwd()}/${config.buildDirs.server}`;

const entrypoints = {
  client: require(`${process.cwd()}/${config.entryFiles.client}`),
  server: require(`${process.cwd()}/${config.entryFiles.server}`),
};

// TODO: support building while server running (i.e. delete module cache)

function registerRoutes(app) {
  const routesEntry = entrypoints.server.routes.assets[0];
  const routes = require(`${serverDir}/${routesEntry}`).default;

  routes.forEach(({ path, view }) => {
    app.get(path, async (req, res) => {
      const serverEntry = entrypoints.server[view].assets[0];
      const component = `${serverDir}/${serverEntry}`;

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
