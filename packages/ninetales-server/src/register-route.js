import config from "./config.json";

import pretty from "pretty";
import { minify } from "html-minifier";
import serialize from "serialize-javascript";

import { h } from "preact";
import render from "preact-render-to-string";

import moduleAlias from "module-alias";
moduleAlias.addAliases(config.alias);

// use require() to work around ilearnio/module-alias/issues/59
const { flushToHTML } = require("styled-jsx/server");

function renderResponse(res, View, locals) {
  const { type, data } = locals;

  if (data.status !== undefined) {
    res.status(data.status);
  }

  if (type === "full") {
    locals.app = render(<View {...data.props} />);
    locals.styles = flushToHTML();
    locals.serialize = serialize;
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

export default function registerRoute(route, view) {
  this.get(route, async (req, res) => {
    const component = `${process.cwd()}/dist/server/views/${view}`;

    if (process.env.NODE_ENV === "development") {
      delete require.cache[require.resolve(component)];
    }

    const { default: View, getData } = require(component);

    renderResponse(res, View, {
      type: res.locals.type || "full",
      data: await getData(),
    });
  });
}
