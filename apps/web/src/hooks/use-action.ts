import { useCallback } from "react";
import { useStatus } from "./use-status";

type UseActionProps = {
  fn: (...args: any) => Promise<Response>;
  onSuccess?: (res: Response) => Promise<string | void> | void | string;
  onError?: (res: Response) => Promise<string | void> | void | string;
  onException?: (err: Error) => Promise<string | void> | string | void;
  onFinished?: () => Promise<void> | void;
}

export function useAction({
  fn, onSuccess, onError, onException, onFinished
}: UseActionProps) {
  const { status, setStatus, loading } = useStatus();
  const action = useCallback(async (...args: any) => {
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
  }, [setStatus, onException, onSuccess, onError, fn])
  return { action, loading, status };
}