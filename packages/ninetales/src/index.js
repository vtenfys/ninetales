import { h, hydrate } from "preact";

function hydrateApp(View) {
  const app = document.getElementById("app");
  const props = JSON.parse(document.getElementById("props").innerHTML);
  hydrate(<View {...props} />, app);
}

export default function ninetales(View) {
  // enable prefetching links
  require("instant.page");

  // hydrate app
  hydrateApp(View);
}

export { default as Dehydrate } from "@ninetales/dehydrate";
