function createHandler(mutable, constructed, { shouldObserve }) {
  return {
    get(target, prop) {
      // only observe if we haven't already done so and if we're supposed to
      if (
        !Object.prototype.hasOwnProperty.call(constructed, prop) &&
        shouldObserve()
      ) {
        const value = Reflect.get(...arguments);

        if (typeof value === "object") {
          // recursively observe objects
          constructed[prop] = Array.isArray(value) ? [] : {};
          mutable[prop] = createObserver(value, constructed[prop], {
            shouldObserve,
          });
        } else {
          constructed[prop] = value;
        }
      }

      return mutable[prop];
    },
  };
}

function createObserver(target, constructed, { shouldObserve }) {
  // clone target to prevent directly modifying it
  const mutable = Array.isArray(target) ? [...target] : { ...target };
  const handler = createHandler(mutable, constructed, { shouldObserve });

  return new Proxy(target, handler);
}

export default function observe(target, { shouldObserve = () => true }) {
  const constructed = {};
  const observable = createObserver(target, constructed, { shouldObserve });

  return [observable, constructed];
}
