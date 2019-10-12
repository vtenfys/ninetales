import HTML, { doctype } from "./html";

import { h } from "preact";
import render from "preact-render-to-string";
import { flush } from "@ninetales/head";

function renderResponse(res, { View, assets, data }) {
  if (data.status !== undefined) {
    res.status(data.status);
  }

  const htmlProps = {
    app: render(<View {...data.props} />),
    head: flush(),
    props: data.props,
    assets,
  };

  const html = doctype + render(<HTML {...htmlProps} />);
  res.send(html);
}

export default renderResponse;
