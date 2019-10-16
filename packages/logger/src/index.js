import colors from "colors/safe";

const levels = {
  0: "info",
  1: "warn",
  2: "err",
};

colors.setTheme({
  0: ["black", "bgBlue"],
  1: ["black", "bgYellow"],
  2: ["black", "bgRed"],
});

export default function log(message, level = 0) {
  const logger = colors.black.bgWhite(" ninetales ");
  const status = colors[level](` ${levels[level].padEnd(4)} `);
  console.log(`${logger}${status} ${message}`);
}
