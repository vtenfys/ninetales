module.exports = () => ({
  presets: [require("../browser")],
  plugins: [
    require("babel-plugin-root-import"),
    require("styled-jsx/babel"),
    [
      require("babel-plugin-transform-define"),
      {
        "typeof window": "object",
      },
    ],
  ],
});
