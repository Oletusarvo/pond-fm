import React from "react";

/**Stops event propagation when  the provided function is called. */
export function useStopPropagation(fn: <T>(e: React.SyntheticEvent<T>) => void | Promise<void>) {
  return async <K>(e?: React.SyntheticEvent<K>) => {
    e?.stopPropagation();
    await fn(e);
  };
}
