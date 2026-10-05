import { useCallback } from "react";
import { cancelPrevious } from "../utils/debounce";

export function useCancelableFunction<TArgs extends any[], TRet>(
  fn: (...args: TArgs) => TRet | null | Promise<TRet | null>,
  delay: number,
) {
  return useCallback(cancelPrevious(fn, delay), [fn, delay]);
}
