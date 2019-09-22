import { h } from "preact";
import navigate from "./navigate";

function Link({ href, children }) {
  return (
    <a
      href={href}
      onClick={event => {
        event.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </a>
  );
}

export default Link;
