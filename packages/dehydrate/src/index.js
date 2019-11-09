import { h } from "preact";
import { memo } from "preact/compat";

function findMarker() {
  const treeWalker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_COMMENT,
    {
      acceptNode(node) {
        return node.textContent === "n-dehydrate"
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }
  );

  return treeWalker.nextNode();
}

function Dehydrate({ children }) {
  if (typeof window === "undefined") {
    return <n-dehydrate>{children}</n-dehydrate>;
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
}

export default memo(Dehydrate, () => true);

export function addDehydrateMarkers(html) {
  // replace <n-dehydrate> wrapper elements with marker comments
  return html
    .replace(/<n-dehydrate>/g, "<!--n-dehydrate-->")
    .replace(/<\/n-dehydrate>/g, "<!--/-->");
}
