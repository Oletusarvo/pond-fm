import { useStatus } from './use-status';

export type ResponseType =
  | {
      success: true;
      data?: any;
    }
  | {
      success: false;
      error?: any;
    };

export type UseSubmitProps = {
  fetchFn: (e: any) => Promise<ResponseType>;
  onSuccess?: (data: any) => Promise<void> | void;
  onError?: (res: Response) => Promise<void> | void;
  onException?: (err: any) => Promise<void> | void;
};

export function useSubmit({ fetchFn, onSuccess, onError, onException }: UseSubmitProps) {
  const { status, loading, setStatus } = useStatus();

  const submit = async (e: any) => {
    e.preventDefault();
    try {
      setStatus('loading');
      const res = await fetchFn(e);
      if (res.success === true) {
        setStatus('success');
        await onSuccess?.(res.data);
      } else {
        const error = res.error ? JSON.parse(res.error) : null;
        setStatus(error?.error || 'error');
        await onError?.(error);
      }
    } catch (err) {
      console.log(err.message);
      setStatus('exception');
      await onException?.(err);
    } finally {
      setStatus(prev => (prev === 'loading' ? 'idle' : prev));
    }
  };

  return { submit, status, loading };
}
