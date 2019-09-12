module.exports = function(api) {
  api.cache(true);

  return {
    presets: [["@babel/preset-env", { targets: { node: "8" } }]],
    plugins: [
      "@babel/plugin-transform-runtime",
      "root-import",
      [
        "@babel/plugin-transform-react-jsx",
        {
          pragma: "h",
          pragmaFrag: "Fragment",
        },
      ],
    ],
    babelrcRoots: [".", "packages/*"],
  };
};
