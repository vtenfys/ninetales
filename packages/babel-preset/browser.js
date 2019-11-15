module.exports = () => ({
  presets: [require("@babel/preset-modules")],
  plugins: [
    require("@babel/plugin-transform-runtime"),
    [
      require("@babel/plugin-transform-react-jsx"),
      {
        pragma: "h",
        pragmaFrag: "Fragment",
      },
    ],
    [
      require("babel-plugin-transform-define"),
      {
        "typeof window": "object",
      },
    ],
  ],
});
