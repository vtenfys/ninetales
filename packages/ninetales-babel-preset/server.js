module.exports = () => ({
  presets: [[require("@babel/preset-env"), { targets: { node: 8 } }]],
  plugins: [
    require("@babel/plugin-transform-runtime"),
    require("babel-plugin-root-import"),
    [
      require("@babel/plugin-transform-react-jsx"),
      {
        pragma: "h",
        pragmaFrag: "Fragment",
      },
    ],
    require("styled-jsx/babel"),
  ],
});
