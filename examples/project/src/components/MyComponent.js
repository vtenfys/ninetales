import { h } from "preact";
import { useState } from "preact/hooks";

export default function MyComponent() {
  console.log("rendering MyComponent");
  const [world] = useState("world");
  return <p data-test-attribute="foo bar">Hello {world}!</p>;
}
