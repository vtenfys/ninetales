export default function withNinetalesStyle(preset, { env }) {
  const config = preset();

  const plugins = [
    ...config.plugins,
    [
      require("../babel"),
      {
        babelOptions: config,
        env,
      },
    ],
  ];

  return () => ({
    ...config,
    plugins,
  });
}
