import { h } from "preact";
import { useState } from "preact/hooks";
import { memo } from "preact/compat";

let nextID = 0;
let markers = null;

export default memo(function Dehydrate({ children }) {
  const [id] = useState(() => nextID++);

  if (typeof window === "undefined") {
    return <n-dehyrate id={id}>{children}</n-dehyrate>;
  }

  if (markers === null) {
    markers = JSON.parse(document.getElementById("markers").innerHTML);
  }

  const [selector, [startIndex, endIndex]] = markers[id];
  let parentNode = document.getElementById("app");

  // get the nth item of the current parent node, as
  // specified by the selector, until reaching the end
  while (selector.length > 0) {
    parentNode = parentNode.childNodes[selector.shift()];
  }

  // get only nodes between the specified indices
  const nodes = [...parentNode.childNodes].slice(startIndex, endIndex);

  return nodes.map((node, index) =>
    // only render elements and text nodes (not comments)
    node instanceof HTMLElement ? (
      <node.localName
        // get attributes & convert to React names where necessary
        key={index}
        dangerouslySetInnerHTML={{ __html: node.innerHTML }}
      />
    ) : node instanceof Text ? (
      node.textContent
    ) : null
  );
});

export function addMarkers(html, rootID) {
  // require here to prevent including in client bundles
  const { parseDOM, DomUtils } = require("htmlparser2");
  const { findOne, find /* append, removeElement */ } = DomUtils;

  // reset ID ready for next page render
  nextID = 0;

  // const markers = [];
  const dom = parseDOM(html);
  const appRoot = findOne(elem => elem.attribs.id === rootID, dom);

  find(
    elem => elem.type === "tag" && elem.name === "n-dehydrate",
    appRoot,
    true, // recurse
    Infinity // limit
  ).forEach((/*wrapper*/) => {
    // Get the parent selector as an array of indices, similar to chained
    // :nth-child() CSS selectors, relative to the `appRoot`.
    //
    // Get the start index of dehydrated content relative to its parent, i.e.
    // position index of the wrapper, and the end index, i.e. start index +
    // length of children - 1.
    //
    // Push the parent selector and start/end indices to `markers`. The index of
    // these within the `markers` array should be the same as the dehydrate ID,
    // due to sequential ordering.
    //
    // Check for surrounding text nodes on each side of the wrapper, and insert
    // empty comments between any found, to keep as separate text nodes after
    // the wrapper has been removed.
    //
    // Remove the surrounding wrapper element, and directly insert its children
    // into the parent.
  });
}
