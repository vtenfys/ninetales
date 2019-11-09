import { h } from "preact";
import { memo } from "preact/compat";
import { ELEMENT_NAME } from "./constants";

function findMarker() {
  const treeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_COMMENT,
    {
      acceptNode(node) {
        return node.textContent === ELEMENT_NAME
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }
  );

  return treeWalker.nextNode();
}

export default memo(function Dehydrate({ children }) {
  if (typeof window === "undefined") {
    return <ELEMENT_NAME>{children}</ELEMENT_NAME>;
  }

  const marker = findMarker();
  const nodes = [];

  let currentNode = marker;
  while (!(currentNode instanceof Comment && currentNode.textContent === "/")) {
    currentNode = currentNode.nextSibling;
    nodes.push(currentNode);
  }

  // remove start + finish marker comments
  marker.remove();
  currentNode.remove();

  return nodes.map((node, index) =>
    node instanceof HTMLElement ? (
      <node.localName
        // TODO: get attributes & convert to React names where necessary
        key={index}
        dangerouslySetInnerHTML={{ __html: node.innerHTML }}
      />
    ) : node instanceof Text ? (
      node.textContent
    ) : null
  );
});

export function addDehydrateMarkers(html) {
  // replace <n-dehydrate> wrapper elements with marker comments
  return html
    .replace(new RegExp(`<${ELEMENT_NAME}>`, "g"), `<!--${ELEMENT_NAME}-->`)
    .replace(new RegExp(`<\\/${ELEMENT_NAME}>`), "<!--/-->");
}
