import { cloneElement } from "preact";

const headTags = [];

function setChildAttributes(child) {
  return cloneElement(child, { "data-jsx": undefined, "data-n-head": "" });
}

export default function Head({ children }) {
  headTags.push(
    Array.isArray(children)
      ? children.map(setChildAttributes)
      : setChildAttributes(children)
  );
  return null;
}

export function flush() {
  return headTags.splice(0, headTags.length).reverse();
}
