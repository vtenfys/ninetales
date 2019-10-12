const withNinetalesStyle = require("@ninetales/style/preset-wrapper").default;

const preset = () => ({
  presets: [require("../browser")],
  plugins: [
    [require("babel-plugin-root-import"), { rootPathSuffix: "src" }],
    [
      require("babel-plugin-transform-define"),
      {
        "typeof window": "object",
      },
    ],
  ],
});

module.exports = withNinetalesStyle(preset, { env: "browser" });
