import React from "react";

export function stopPropagation<T, ET extends React.SyntheticEvent<T>>(
  fn?: (e: ET) => Promise<void> | void,
) {
  return async (e: ET) => {
    e.stopPropagation();
    await fn?.(e);
  };
}
