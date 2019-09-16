module.exports = () => ({
  presets: [
    [
      require("@babel/preset-env"),
      { targets: "> 1%, not dead", modules: false },
    ],
  ],
  plugins: [
    require("@babel/plugin-transform-runtime"),
    [
      require("@babel/plugin-transform-react-jsx"),
      {
        pragma: "h",
        pragmaFrag: "Fragment",
      },
    ],
  ],
});
