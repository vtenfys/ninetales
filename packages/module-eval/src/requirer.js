import { _nodeModulePaths } from "module";
import { readFileSync } from "fs";
import { dirname } from "path";
import evaluate from "./index";

export default function requirer({ _module, babelOptions }) {
  function _require(id) {
    const modulePath = require.resolve(id, {
      paths: _nodeModulePaths(dirname(_module.filename)),
    });

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

  return _require;
}
