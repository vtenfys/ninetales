import express from "express";
import compression from "compression";
import registerRoute from "./register-route";
import config from "./config.json";

const app = express();

app.use(compression({ level: config.compressionLevel }));
app.use(express.static(`${process.cwd()}/dist/client`));

app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/.data/*", (req, res, next) => {
  res.locals.type = "data";
  req.url = req.path.replace(/^\/\.data/, "");
  next();
});

// register user-defined routes
// require(`${process.cwd()}/dist/routes`).default(registerRoute(app));
registerRoute(app)("/*", "Page");

app.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`);
});
