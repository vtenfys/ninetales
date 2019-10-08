import { dirname } from "path";
import Module from "module";
import requirer from "./requirer";

import { transformSync } from "@babel/core";
import { runInNewContext } from "vm";

export default function evaluate({
  code: rawCode,
  filename,
  parent = undefined,
  babelOptions = {},
}) {
  const _module = new Module(filename, parent);
  const _require = requirer({ _module, babelOptions });

  const sandbox = {
    __dirname: dirname(filename),
    __filename: filename,
    exports: _module.exports,
    module: _module,
    require: _require,
  };

  const { code } = transformSync(rawCode, babelOptions);

  // runInNewContext returns the last statement executed, so append
  // module.exports to our code
  return runInNewContext(code + "\nmodule.exports;", sandbox, { filename });
}
