import { h, Fragment } from "preact";
import { useState } from "preact/hooks";
import { memo } from "preact/compat";

let nextID = 0;

function Dehydrate({ children }) {
  const [id] = useState(() => nextID++);

  if (typeof window === "undefined") {
    const render = require("preact-render-to-string");
    const { parseDOM } = require("htmlparser2");

    const html = render(children);
    const dom = parseDOM(html);

    return (
      <>
        <script type={`n-dehydrate-${id}`}>{dom.length}</script>
        {children}
      </>
    );
  }

  const marker = document.querySelector(`script[type="n-dehydrate-${id}"]`);
  if (!marker) {
    // TODO: console.warn here in development?
    return null;
  }

  const childCount = Number(marker.innerHTML);
  const nodes = [];

  for (let i = 0, currentNode = marker; i < childCount; i += 1) {
    currentNode = currentNode.nextSibling;
    nodes.push(currentNode);
  }

  return nodes.map((node, index) =>
    // only render elements and text nodes (not comments)
    node instanceof HTMLElement ? (
      <node.localName key={index} dangerouslySetInnerHTML={{ __html: "" }} />
    ) : node instanceof Text ? (
      node.textContent
    ) : null
  );
}

export default memo(Dehydrate, () => true);

export function resetNextID() {
  nextID = 0;
}
