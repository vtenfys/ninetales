import { h, render, cloneElement } from "preact";
import { useState, useEffect } from "preact/hooks";

const headTags = [];
let nextID = 0;

export function flush() {
  nextID = 0;
  return headTags.splice(0, headTags.length);
}

function HeadTag({ children: child }) {
  const [id] = useState(() => nextID++);
  child = cloneElement(child, { "data-n-head": id });

  if (typeof window === "undefined") {
    headTags.push(child);
  } else {
    const replaceNode =
      document.querySelector(`[data-n-head="${id}"]`) ||
      document.createElement(child.type);

    useEffect(() => {
      return () => {
        replaceNode.remove();
      };
    }, []);

    render(child, document.head, replaceNode);
  }

  return null;
}

function wrapTag(TagName, innerHTML = false) {
  // Individual wrapped tag components get their display name
  // when defined below, so we don't need to specify one here:
  // eslint-disable-next-line react/display-name
  return ({ children, ...props }) => (
    <HeadTag>
      {innerHTML ? (
        <TagName dangerouslySetInnerHTML={{ __html: children }} {...props} />
      ) : (
        <TagName {...props}>{children}</TagName>
      )}
    </HeadTag>
  );
}

export const Title = wrapTag("title");
export const Base = wrapTag("base");
export const Link = wrapTag("link");
export const Style = wrapTag("style", true);
export const Meta = wrapTag("meta");
export const Script = wrapTag("script", true);
export const NoScript = wrapTag("noscript");
export const Template = wrapTag("template");
