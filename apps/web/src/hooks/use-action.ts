import { useCallback } from "react";
import { useStatus } from "./use-status";

type AsyncFn<ArgsT extends any[] = any[]> =
  (...args: ArgsT) => Promise<Response>;

type UseActionProps<ArgsT extends any[]> = {
  fn: AsyncFn<ArgsT>,
  onSuccess?: (res: Response) => Promise<string | void> | void | string;
  onError?: (res: Response) => Promise<string | void> | void | string;
  onException?: (err: Error) => Promise<string | void> | string | void;
  onFinished?: () => Promise<void> | void;
}

export function useAction<ArgsT extends any[]>({
  fn, onSuccess, onError, onException, onFinished
}: UseActionProps<ArgsT>) {
  const { status, setStatus, loading } = useStatus();
  const action = async (...args: ArgsT) => {
    setStatus('loading');
    try {
      const res = await fn(...args);
      if (!res.ok) {
        setStatus(await onError?.(res) || 'error');
      }
      else {
        setStatus(await onSuccess?.(res) || 'success');
      }
    } catch (error) {
      console.log(error.message, error.stack);
      setStatus(await onException?.(error) || 'exception');
    }
    finally {
      onFinished?.();
      setStatus(prev => prev === 'loading' ? 'idle' : prev);
    }
  }
  return { action, loading, status };
}