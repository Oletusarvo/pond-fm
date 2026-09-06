import { useAction } from "./use-action";

export type UseSubmitProps = Omit<Parameters<typeof useAction>[0], "fn"> & {
  fetchFn: (
    payload: FormData,
  ) => ReturnType<Parameters<typeof useAction>[0]["fn"]>;
};

export function useSubmit({ fetchFn, ...props }: UseSubmitProps) {
  const { action, status, loading } = useAction({
    ...props,
    fn: async (e) => {
      e.preventDefault();
      const payload = new FormData(e.currentTarget);
      return await fetchFn(payload);
    },
  });

  return { submit: action, status, loading };
}
