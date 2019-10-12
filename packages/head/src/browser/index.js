import { cloneElement } from "preact";
import { useEffect } from "preact/hooks";
import { createPortal } from "preact/compat";

function stripDataJsx(child) {
  return cloneElement(child, { "data-jsx": undefined });
}

let ssrHeadTagsPruned = false;

export default function Head({ children }) {
  useEffect(() => {
    if (!ssrHeadTagsPruned) {
      document.querySelectorAll("[data-ssr-head]").forEach(el => el.remove());
      ssrHeadTagsPruned = true;
    }
  }, []);

  return createPortal(
    Array.isArray(children)
      ? children.map(stripDataJsx)
      : stripDataJsx(children),
    document.head
  );
}
