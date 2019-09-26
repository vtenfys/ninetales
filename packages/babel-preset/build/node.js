module.exports = () => ({
  presets: [require("../node")],
  plugins: [
    require("babel-plugin-root-import"),
    [
      require("babel-plugin-module-resolver"),
      {
        alias: { "@ninetales/ninetales": "@ninetales/ninetales/dist/node" },
      },
    ],
  ],
});
