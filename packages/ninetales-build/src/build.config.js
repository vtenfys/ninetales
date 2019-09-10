export default function(api) {
  api.cache(true);

  return {
    presets: ["@ninetales/build"],
  };
}
