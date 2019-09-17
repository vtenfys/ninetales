module.exports = () => ({
  presets: [require("../node")],
  plugins: [require("babel-plugin-root-import"), require("styled-jsx/babel")],
});
