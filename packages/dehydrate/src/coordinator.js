import EventEmitter from "events";

const coordinator = new EventEmitter();
export default coordinator;

let depth = 0;

export function open() {
  depth += 1;
  if (depth === 1) {
    coordinator.emit("open");
  }
}

export function close() {
  depth -= 1;
  if (depth === 0) {
    coordinator.emit("close");
  }
}
