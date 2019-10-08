export default function withNinetalesStyle(preset, { env }) {
  const config = preset();

  const babelOptions = {
    ...config,
    presets: [
      ...config.presets,
      [require("@babel/preset-env"), { targets: { node: 8 } }],
    ],
  };

  return () => ({
    ...config,
    plugins: [...config.plugins, [require("../babel"), { babelOptions, env }]],
  });
}
