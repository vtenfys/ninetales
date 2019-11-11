import { h, render, cloneElement } from "preact";
import { useState, useEffect } from "preact/hooks";

const HEAD_ATTRIBUTE = "data-n-head";
const headTags = [];

export function flush() {
  return headTags.splice(0, headTags.length);
}

let dynamicGenerationPaused = false;

// useful in conjunction with @ninetales/dehydrate
export function pauseDynamicGeneration() {
  dynamicGenerationPaused = true;
  return () => {
    dynamicGenerationPaused = false;
  };
}

function HeadTag({ children: child }) {
  if (typeof window === "undefined") {
    if (!dynamicGenerationPaused) {
      child = cloneElement(child, { [HEAD_ATTRIBUTE]: "" });
    }

    headTags.push(child);
  } else {
    const [replaceNode] = useState(
      () =>
        document.querySelector(`[${HEAD_ATTRIBUTE}]`) ||
        document.createElement(child.type)
    );

    if (replaceNode.hasAttribute(HEAD_ATTRIBUTE)) {
      replaceNode.removeAttribute(HEAD_ATTRIBUTE);
    }

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

// from https://developer.mozilla.org/en-US/docs/Web/HTML/Element/head#See_also
export const Title = wrapTag("title");
export const Base = wrapTag("base");
export const Link = wrapTag("link");
export const Style = wrapTag("style", true);
export const Meta = wrapTag("meta");
export const Script = wrapTag("script", true);
export const NoScript = wrapTag("noscript");
export const Template = wrapTag("template");
