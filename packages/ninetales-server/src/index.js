import express from "express";
import compression from "compression";
import config from "./server.config.json";

const app = express();
const registerRoute = require("./register-route").default(app);

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
// require(`${process.cwd()}/dist/routes`)(registerRoute);
registerRoute("/*", "Page");

app.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`);
});
