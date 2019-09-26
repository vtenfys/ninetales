module.exports = () => ({
  presets: [require("../browser")],
  plugins: [
    require("babel-plugin-root-import"),
    [
      require("babel-plugin-transform-define"),
      {
        "typeof window": "object",
      },
    ],
    // TODO: create a custom plugin to do this (+ allow for dynamic styles?)
    [
      require("babel-plugin-remove-react-element"),
      {
        elementNames: ["_JSXStyle"],
      },
    ],
  ],
});
