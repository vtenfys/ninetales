const withNinetalesStyle = require("@ninetales/style/preset-wrapper").default;

const preset = () => ({
  presets: [require("../node")],
  plugins: [[require("babel-plugin-root-import"), { rootPathSuffix: "src" }]],
});

module.exports = withNinetalesStyle(preset, { env: "server" });
