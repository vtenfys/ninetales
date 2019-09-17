import { h, hydrate as preactHydrate } from "preact";

export function notUsed() {
  console.log("test123 this should not appear in the bundle");
}

export function hydrate(View) {
  const props = JSON.parse(document.getElementById("props").innerHTML);
  preactHydrate(<View {...props} />, document.getElementById("app"));
}
