import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { TApiResponse } from "../utils/api/types";

type UseQueryParameters = Parameters<typeof useQuery>[0];

type UsePollingProps = {
  maxTries?: number;
  queryKey: UseQueryParameters["queryKey"];
  queryFn: () => Promise<TApiResponse>;
  pollingInterval?: UseQueryParameters["refetchInterval"];
  onData: <T>(data: T) => boolean;
  onSuccess?: () => Promise<void> | void;
  onError?: (error: Error) => Promise<void> | void;
  onMaxTries?: () => void;
};

/**Provides functionality for polling the back-end. */
export function usePolling({
  maxTries = Infinity,
  pollingInterval = 1500,
  queryKey,
  queryFn,
  onData,
  onError,
  onSuccess,
  onMaxTries,
}: UsePollingProps) {
  const fetchEnabledRef = useRef(true);
  const tries = useRef(0);
  const { data, isFetching, isError, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await queryFn();
      if (!res.success) {
        throw new Error("Failed to get subscription status!");
      }

      return res.success ? res.data : null;
    },
    refetchInterval: pollingInterval,
    enabled: fetchEnabledRef.current,
  });

  useEffect(() => {
    if (data && !isFetching && fetchEnabledRef.current) {
      tries.current++;

      if (!isError) {
        fetchEnabledRef.current = onData(data);
        if (!fetchEnabledRef.current) {
          onSuccess();
        }
      } else {
        onError?.(error as Error);
      }
      if (tries.current >= maxTries) {
        fetchEnabledRef.current = false;
        onMaxTries?.();
      }
    }
  }, [
    data,
    isFetching,
    isError,
    onData,
    onError,
    fetchEnabledRef.current,
    tries.current,
    maxTries,
  ]);

  return { isPending: isFetching, isError };
}
