module.exports = function(api) {
  api.cache(true);

  return {
    presets: ["@babel/preset-env"],
    plugins: ["root-import"],
    babelrcRoots: [".", "packages/*"]
  };
};
