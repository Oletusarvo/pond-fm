import { useAction } from './use-action';
import { useStatus } from './use-status';

export type UseSubmitProps = Omit<Parameters<typeof useAction>[0], 'fn'> & {
  fetchFn: (payload: FormData) => Promise<Response>;
};

export function useSubmit({ fetchFn, ...props }: UseSubmitProps) {
  const { action, status, loading } = useAction({
    ...props,
    fn: async (e) => {
      e.preventDefault();
      const payload = new FormData(e.currentTarget);
      return await fetchFn(payload);
    }
  });

  return { submit: action, status, loading };
}
