import express from "express";
import registerRoute from "./register-route";
import config from "./config.json";

const app = express();

// TODO: use React to render full HTML rather than EJS
app.use(express.static("./dist/client"));
app.set("view engine", "ejs");
app.set("views", `${__dirname}/views`);

app.get("/.data/*", (req, res, next) => {
  res.locals.type = "data";
  req.url = req.path.replace(/^\/\.data/, "");
  next();
});

// register user-defined routes
require(`${process.cwd()}/dist/server/routes`).default(registerRoute(app));

export default app;

// TODO: move to CLI
app.listen(config.port, () => {
  console.log(`Listening on http://localhost:${config.port}`);
});
