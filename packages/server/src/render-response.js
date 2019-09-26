import HTML, { doctype } from "./html";

import { h } from "preact";
import render from "preact-render-to-string";

function renderResponse(res, { View, bundles, data }) {
  if (data.status !== undefined) {
    res.status(data.status);
  }

  const htmlProps = {
    app: render(<View {...data.props} />),
    props: data.props,
    bundles,
  };

  const html = doctype + render(<HTML {...htmlProps} />);
  res.send(html);
}

export default renderResponse;
