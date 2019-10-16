import colors from "colors/safe";

export function fileHasExtension(file, extensions) {
  return !!extensions.find(ext => file.endsWith(`.${ext}`));
}

export function log(message, logger) {
  const color = logger ? colors.black.bgMagenta : colors.black.bgYellow;
  logger = color(` ${logger ? logger[0] : "n"} `);

  message.split("\n").forEach(line => {
    console.log(`${logger} ${line}`);
  });
}
