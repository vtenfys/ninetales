module.exports = () => ({
  presets: [
    [require("@babel/preset-env"), { useBuiltIns: "usage", corejs: 3 }],
  ],
  plugins: [
    require("babel-plugin-root-import"),
    [
      require("@babel/plugin-transform-react-jsx"),
      {
        pragma: "h",
        pragmaFrag: "Fragment",
      },
    ],
  ],
});
