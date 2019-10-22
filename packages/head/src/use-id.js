import { useState, useEffect } from "preact/hooks";

let nextID = 0;

export default function useID() {
  const [shouldIncrementID, setShouldIncrementID] = useState(true);
  const [id] = useState(nextID);

  // prevent incrementing `id` on subsequent renders
  useEffect(() => {
    setShouldIncrementID(false);
  }, []);

  if (shouldIncrementID) {
    nextID += 1;
  }

  return id;
}

export function resetNextID() {
  nextID = 0;
}
