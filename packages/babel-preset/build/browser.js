const config = require("@ninetales/config").default;
const withNinetalesStyle = require("@ninetales/style/preset-wrapper").default;

const preset = () => ({
  presets: [require("../browser")],
  plugins: [
    [
      require("babel-plugin-root-import"),
      { rootPathSuffix: config.buildDirs.prebuild },
    ],
    require("@ninetales/dehydrate/babel/browser"),
  ],
});

module.exports = withNinetalesStyle(preset, { env: "browser" });
