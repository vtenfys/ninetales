module.exports = () => ({
  presets: [[require("@babel/preset-env"), { targets: { node: 8 } }]],
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
        "typeof window": "undefined",
      },
    ],
  ],
});
