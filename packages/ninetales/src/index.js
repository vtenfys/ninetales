import { h, hydrate } from "preact";
import navigate from "./navigate";

export function notUsed() {
  console.log("test123 this should not appear in the bundle");
}

export function startRuntime(View) {
  const props = JSON.parse(document.getElementById("props").innerHTML);
  hydrate(<View {...props} />, document.getElementById("app"));
  window.navigate = navigate; // TODO: remove later
}
