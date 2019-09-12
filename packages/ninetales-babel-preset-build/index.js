module.exports = () => ({
  presets: [[require("@babel/preset-env"), { targets: "> 1%, not dead" }]],
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
