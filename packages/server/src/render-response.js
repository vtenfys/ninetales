import HTML, { DOCTYPE } from "./html";

import { h } from "preact";
import render from "preact-render-to-string";

import { resetNextID } from "@ninetales/dehydrate";
import { flush } from "@ninetales/head";
import observe from "@ninetales/entrapta";

export default function renderResponse(res, { View, assets, data }) {
  if (data.status !== undefined) {
    res.status(data.status);
  }

  // Preact spreads props when creating a VNode, which is treated as accessing
  // all properties of the props object. So initially, create a VNode using the
  // original props, then observe the spreaded props rather than the original
  // ones, so that we can strip top-level props which are unused entirely.
  const view = <View {...data.props} />;

  // only props accessed via observableProps make it to constructedProps
  const [observableProps, constructedProps] = observe(view.props);

  // assign observable props to the view, in order to track observations
  view.props = observableProps;

  const htmlProps = {
    app: render(view),
    lang: data.lang,
    head: flush(),
    props: constructedProps,
    assets,
  };

  res.send(DOCTYPE + render(<HTML {...htmlProps} />));
  resetNextID();
}
