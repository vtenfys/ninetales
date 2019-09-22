import config from "./config.json";
import moduleAlias from "module-alias";
moduleAlias.addAliases(config.alias);

import { h } from "preact";
import render from "preact-render-to-string";
const flush = require("styled-jsx/server").default;

import HTML, { doctype } from "./html";
import pretty from "pretty";

function renderResponse(res, { View, bundles, full, data }) {
  if (data.status !== undefined) {
    res.status(data.status);
  }

  const htmlProps = { full };

  if (full) {
    htmlProps.app = render(<View {...data.props} />);
    htmlProps.appProps = data.props;
    htmlProps.styles = flush();
    htmlProps.bundles = bundles;
  }

  let html = doctype + render(<HTML {...htmlProps} />);

  if (process.env.NODE_ENV === "development") {
    html = pretty(html);
  }

  if (full) {
    res.send(html);
  } else {
    res.json({ html, data });
  }
}

export default renderResponse;
