const withNinetalesStyle = require("@ninetales/style/preset-wrapper").default;

const preset = () => ({
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

module.exports = withNinetalesStyle(preset, { env: "server" });
