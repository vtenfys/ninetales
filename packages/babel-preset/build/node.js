const withNinetalesStyle = require("@ninetales/style/preset-wrapper").default;

const preset = () => ({
  presets: [require("../node")],
  plugins: [
    [require("babel-plugin-root-import"), { rootPathSuffix: "src" }],
    [
      require("babel-plugin-transform-define"),
      {
        "typeof window": "undefined",
      },
    ],
  ],
});

module.exports = withNinetalesStyle(preset, { env: "server" });
