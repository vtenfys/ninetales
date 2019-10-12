import { h } from "preact";
import { createPortal } from "preact/compat";

export function Title({ children }) {
  return typeof window !== "undefined"
    ? createPortal(<title>{children}</title>, document.head)
    : null;
}
