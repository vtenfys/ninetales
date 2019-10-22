import { h, render, cloneElement } from "preact";
import { useEffect } from "preact/hooks";
import useID, { resetNextID } from "./use-id";

const headTags = [];

export function flush() {
  resetNextID();
  return headTags.splice(0, headTags.length);
}

function setChildAttributes(child, id) {
  return cloneElement(child, { "data-jsx": undefined, "data-n-head": id });
}

function HeadTag({ children: child }) {
  const id = useID();
  child = setChildAttributes(child, id);

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

export const Title = props => (
  <HeadTag>
    <title {...props} />
  </HeadTag>
);

export const Base = props => (
  <HeadTag>
    <base {...props} />
  </HeadTag>
);

export const Link = props => (
  <HeadTag>
    <link {...props} />
  </HeadTag>
);

export const Style = ({ children: __html, ...props }) => (
  <HeadTag>
    <style {...props} dangerouslySetInnerHTML={{ __html }} />
  </HeadTag>
);

export const Meta = props => (
  <HeadTag>
    <meta {...props} />
  </HeadTag>
);

export const Script = ({ children: __html, ...props }) => (
  <HeadTag>
    <script {...props} dangerouslySetInnerHTML={{ __html }} />
  </HeadTag>
);

export const NoScript = props => (
  <HeadTag>
    <noscript {...props} />
  </HeadTag>
);

export const Template = props => (
  <HeadTag>
    <template {...props} />
  </HeadTag>
);
