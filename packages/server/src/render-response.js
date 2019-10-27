import HTML, { doctype } from "./html";

import { h } from "preact";
import render from "preact-render-to-string";
import { flush } from "@ninetales/head";
import observe from "@ninetales/entrapta";

function renderResponse(res, { View, assets, data }) {
  if (data.status !== undefined) {
    res.status(data.status);
  }

  // deep strip unused props:
  // only props accessed via observableProps make it to constructedProps
  const [observableProps, constructedProps] = observe(data.props);

  const htmlProps = {
    app: render(<View {...observableProps} />),
    lang: data.lang,
    head: flush(),
    props: constructedProps,
    assets,
  };

  const html = doctype + render(<HTML {...htmlProps} />);
  res.send(html);
}

export default renderResponse;
