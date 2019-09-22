import { h, render, hydrate } from "preact";
import navigate from "./navigate";
import Link from "./link";

function startRuntime() {
  if (window._ninetalesRuntimeStarted) return;
  window._ninetalesRuntimeStarted = true;

  window.onpopstate = () => navigate(location.href, false);
}

function startApp(View) {
  const app = document.getElementById("app");
  const props = JSON.parse(document.getElementById("props").innerHTML);

  if (app.childElementCount === 0) {
    render(<View {...props} />, app);
  } else {
    hydrate(<View {...props} />, app);
  }
}

function main(View) {
  // start persistent runtime
  startRuntime();

  // render/hydrate app
  startApp(View);
}

export { navigate, Link, main };
