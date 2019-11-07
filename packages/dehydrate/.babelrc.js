module.exports = {
  presets: [
    process.env.ENV === "browser"
      ? "@ninetales/babel-preset/browser"
      : "@ninetales/babel-preset/node",
  ],
};
