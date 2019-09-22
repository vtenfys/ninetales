import config from "./config.json";
import moduleAlias from "module-alias";
moduleAlias.addAliases(config.alias);

import pretty from "pretty";
import { minify } from "html-minifier";
import serialize from "serialize-javascript";

import { h } from "preact";
import render from "preact-render-to-string";
import { flushToHTML } from "styled-jsx/server";

export default function renderResponse(res, View, bundles, locals) {
  const { type, data } = locals;

  if (data.status !== undefined) {
    res.status(data.status);
  }

  if (type === "full") {
    locals.app = render(<View {...data.props} />);
    locals.styles = flushToHTML();
    locals.serialize = serialize;
    locals.bundles = bundles;
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
