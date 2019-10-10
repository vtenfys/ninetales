import colors from "colors/safe";

export function fileHasExtension(file, extensions) {
  return !!extensions.find(ext => file.endsWith(`.${ext}`));
}

export function log(message, logger) {
  const color = logger ? colors.magenta.bold : colors.yellow.bold;
  logger = color(`[${logger || "ninetales"}]`.padEnd(12));

  message.split("\n").forEach(line => {
    console.log(`${logger} ${line}`);
  });
}
