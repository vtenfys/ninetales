import config from "./config.json";
import HTML, { doctype } from "@ninetales/ninetales/dist/node/html";

import { h } from "preact";
import render from "preact-render-to-string";
import pretty from "pretty";
import { parse } from "node-html-parser";

import moduleAlias from "module-alias";

// see: https://github.com/babel/babel/issues/2061
moduleAlias.addAliases(config.alias);
const { flushToHTML } = require("styled-jsx/server");

function renderResponse(res, { View, bundles, minimal, data }) {
  if (data.status !== undefined) {
    res.status(data.status);
  }

  const app = render(<View {...data.props} />);
  const styles = parse(flushToHTML(), { style: true })
    .childNodes.filter(el => el.tagName === "style")
    .map(({ id, rawText }) => [id, rawText]);

  const htmlProps = {
    app,
    props: data.props,
    styles,
    bundles,
  };

  if (minimal) {
    res.json(htmlProps);
  } else {
    let html = doctype + render(<HTML {...htmlProps} />);
    if (process.env.NODE_ENV === "development") {
      html = pretty(html);
    }

    res.send(html);
  }
}

export default renderResponse;
