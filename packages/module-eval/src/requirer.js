import { readFileSync } from "fs";
import { dirname } from "path";
import evaluate from "./index";

export default function requirer({ _module, babelOptions }) {
  function _resolve(id, options) {
    // don't specify the search paths if already defined
    if (typeof options === "object" && options.paths !== undefined) {
      return require.resolve(id, options);
    }

    return require.resolve(id, {
      ...options,
      paths: [dirname(_module.filename)],
    });
  }

  function _require(id) {
    const modulePath = _resolve(id);

    // use native require for built-in modules and ones from node_modules
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
      filename: modulePath,
      parent: _module,
      babelOptions,
    });
  }

  _require.cache = require.cache;
  _require.main = _module;
  _require.resolve = _resolve;

  return _require;
}
