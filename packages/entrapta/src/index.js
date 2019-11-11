let observationPaused = false;

// useful in conjunction with @ninetales/dehydrate
export function pauseObservation() {
  observationPaused = true;
  return () => {
    observationPaused = false;
  };
}

function createHandler(mutable, constructed) {
  return {
    get(target, prop) {
      if (
        !Object.prototype.hasOwnProperty.call(constructed, prop) &&
        !observationPaused
      ) {
        const value = Reflect.get(...arguments);

        if (typeof value === "object") {
          // recursively observe objects
          constructed[prop] = Array.isArray(value) ? [] : {};
          mutable[prop] = createObserver(value, constructed[prop]);
        } else {
          constructed[prop] = value;
        }
      }

      return mutable[prop];
    },
  };
}

function createObserver(target, constructed) {
  // clone target to prevent directly modifying it
  const mutable = Array.isArray(target) ? [...target] : { ...target };
  const handler = createHandler(mutable, constructed);

  return new Proxy(target, handler);
}

export default function observe(obj) {
  const constructed = {};
  const observable = createObserver(obj, constructed);

  return [observable, constructed];
}
