const config = require("@ninetales/config").default;
const withNinetalesStyle = require("@ninetales/style/preset-wrapper").default;

const preset = () => ({
  presets: [require("../node")],
  plugins: [
    [
      require("babel-plugin-root-import"),
      { rootPathSuffix: config.buildDirs.prebuild },
    ],
    require("@ninetales/dehydrate/babel/node"),
  ],
});

module.exports = withNinetalesStyle(preset, { env: "server" });
