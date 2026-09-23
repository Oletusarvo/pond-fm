import { TApiErrorResponse, TApiResponse, TApiSuccessResponse } from "../utils/api/types";
import { useStatus } from "./use-status";

type Fn<T, E, ArgsT extends any[] = any[]> = (...args: ArgsT) => Promise<TApiResponse<T, E>>;

type UseActionProps<T, E, ArgsT extends any[]> = {
  /**
   * The asynchronous method to call.
   */
  fn: Fn<T, E, ArgsT>;
  /**
   * The method called when the action finishes successfully. Can optionally return a string which is set as the status.
   */
  onSuccess?: (res: TApiSuccessResponse<T>) => Promise<string | void> | void | string;
  /**
   * The method called if the action fails. Can optionally return a string which is set as the status.
   */
  onError?: (res: TApiErrorResponse<E>) => Promise<string | void> | void | string;
  /**
   * The method called if the action throws an error. Optionally returns a string which is set as the status.
   */
  onException?: (err: Error) => Promise<string | void> | string | void;
  /**
   * The method called after onSuccess and onError.
   */
  onFinished?: () => Promise<void> | void;
};

/**Provides functionality for calling an asynchronous method while keeping track of the state of the call. */
export function useAction<T = unknown, E = unknown, ArgsT extends any[] = []>({
  fn,
  onSuccess,
  onError,
  onException,
  onFinished,
}: UseActionProps<T, E, ArgsT>) {
  const { status, setStatus, loading, error } = useStatus();
  const action = async (...args: ArgsT) => {
    setStatus("loading");
    try {
      const res = await fn(...args);
      if (res.success === false) {
        setStatus((await onError?.(res)) || "error");
      } else {
        setStatus((await onSuccess?.(res)) || "success");
      }
    } catch (error) {
      console.log(error.message, error.stack);
      setStatus((await onException?.(error)) || "exception");
    } finally {
      onFinished?.();
      setStatus((prev) => (prev === "loading" ? "idle" : prev));
    }
  };
  return { action, loading, status, error };
}
