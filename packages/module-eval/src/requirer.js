import { readFileSync } from "fs";
import { dirname } from "path";
import evaluate from "./index";

function _require(id, base) {
  const modulePath = require.resolve(id, { paths: [base] });

  if (
    id !== "." &&
    !id.startsWith("/") &&
    !id.startsWith("./") &&
    !id.startsWith("../")
  ) {
    return require(modulePath);
  }

  return evaluate({
    code: readFileSync(modulePath, "utf8"),
    base: dirname(modulePath),
  });
}

export default function requirer(base) {
  return id => _require(id, base);
}
