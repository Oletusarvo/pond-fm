import { useEffect } from "react";

type UseUpdateStoreProps<DataT extends any[]> = {
  data: DataT | null;
  isPending: boolean;
  onData: (data: DataT) => void;

}
export function useUpdateStore<DataT extends any[]>({
  data,
  isPending,
  onData,
}: UseUpdateStoreProps<DataT>) {
  useEffect(() => {
    if (data && !isPending) {
      onData(data);
    }
  }, [data, isPending]);
}