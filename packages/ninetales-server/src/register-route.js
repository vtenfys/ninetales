import pretty from "pretty";
import { minify } from "html-minifier";
import config from "./config.json";

import { h } from "preact";
import render from "preact-render-to-string";

import moduleAlias from "module-alias";
moduleAlias.addAliases(config.alias);

// use require() to work around ilearnio/module-alias/issues/59
const { flushToHTML } = require("styled-jsx/server");

function renderResponse(res, Page, locals) {
  const { type, data } = locals;

  if (type === "full") {
    locals.app = render(<Page {...data} />);
    locals.styles = flushToHTML();
  }

  res.render("page", locals, (err, html) => {
    if (err) throw err;

    if (process.env.NODE_ENV === "development") {
      html = pretty(html);
    } else {
      html = minify(html, config.minify);
    }

    if (type === "data") {
      res.json({ html, data });
    } else {
      res.send(html);
    }
  });
}

function registerRoute(app, route, view) {
  app.get(route, async (req, res) => {
    const component = `${process.cwd()}/dist/server/views/${view}`;

    if (process.env.NODE_ENV === "development") {
      delete require.cache[require.resolve(component)];
    }

    const { default: Page, getData } = require(component);

    renderResponse(res, Page, {
      type: res.locals.type || "full",
      data: await getData()
    });
  });
}

export default function(app) {
  return (route, view) => registerRoute(app, route, view);
}
