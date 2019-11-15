import { h } from "preact";
import { memo } from "preact/compat";

import * as coordinator from "./coordinator";
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

const Dehydrate = memo(function Dehydrate() {
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
      // see https://github.com/facebook/react/issues/10923#issuecomment-338715787
      <node.localName key={index} dangerouslySetInnerHTML={{ __html: "" }} />
    ) : node instanceof Text ? (
      node.textContent
    ) : null
  );
});

if (typeof window === "undefined") {
  Dehydrate.Server = function ServerDehydrate({ children }) {
    // send an event which can be listened e.g. by entrapta to pause watching for
    // property access for dehydrated content, by n-head to pause adding special
    // data attributes for rehydration, etc
    coordinator.open();

    children = Array.isArray(children)
      ? children.map(child => child())
      : children();

    // tell event listeners to unpause
    coordinator.close();
    return <ELEMENT_NAME>{children}</ELEMENT_NAME>;
  };
}

export default Dehydrate;

export function addDehydrateMarkers(html) {
  // replace <n-dehydrate> wrapper elements with marker comments
  // TODO: if a nested structure is detected, remove inner wrappers
  return html
    .replace(new RegExp(`<${ELEMENT_NAME}>`, "g"), `<!--${ELEMENT_NAME}-->`)
    .replace(new RegExp(`<\\/${ELEMENT_NAME}>`, "g"), "<!--/-->");
}
