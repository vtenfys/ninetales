import { h, render, cloneElement } from "preact";
import { useState } from "preact/hooks";

const headTags = [];
let nextID = 0;

function setChildAttributes(child, id) {
  return cloneElement(child, { "data-jsx": undefined, "data-n-head": id });
}

function HeadTag({ children: child }) {
  const [id] = useState(nextID++);
  child = setChildAttributes(child, id);

  if (typeof window === "undefined") {
    headTags.push(child);
  } else {
    let replaceNode = document.querySelector(`[data-n-head="${id}"]`);
    if (!replaceNode) {
      replaceNode = document.createTextNode("");
      document.head.appendChild(replaceNode);
    }

    render(child, document.head, replaceNode);
  }

  return null;
}

export function Title(props) {
  return (
    <HeadTag>
      <title {...props} />
    </HeadTag>
  );
}

export function Meta(props) {
  return (
    <HeadTag>
      <meta {...props} />
    </HeadTag>
  );
}

export function flush() {
  nextID = 0;
  return headTags.splice(0, headTags.length);
}
