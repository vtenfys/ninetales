import config from "./config.json";
import HTML, { doctype } from "./html";

import { h } from "preact";
import render from "preact-render-to-string";
import moduleAlias from "module-alias";

// see: https://github.com/babel/babel/issues/2061
moduleAlias.addAliases(config.alias);
const flush = require("styled-jsx/server").default;

function renderResponse(res, { View, bundles, data }) {
  if (data.status !== undefined) {
    res.status(data.status);
  }

  const htmlProps = {
    app: render(<View {...data.props} />),
    styles: flush(),
    props: data.props,
    bundles,
  };

  const html = doctype + render(<HTML {...htmlProps} />);
  res.send(html);
}

export default renderResponse;
