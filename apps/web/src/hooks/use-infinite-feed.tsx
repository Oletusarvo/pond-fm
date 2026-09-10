import { useInfiniteQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { TApiResponse } from "../utils/api/types";

export type UseInfiniteFeedProps = Omit<
  Parameters<typeof useInfiniteQuery>[0],
  "initialPageParam" | "getNextPageParam" | "placeholderData" | "queryFn"
> & {
  queryFn: (cursor?: string) => Promise<TApiResponse>;
};

/**Provides functionality for building infinite feeds. Uses tanstack useInfiniteQuery; abstracting away most of its setup. */
export function useInfiniteFeed({ queryFn, ...props }: UseInfiniteFeedProps) {
  const { data, fetchNextPage, ...query } = useInfiniteQuery({
    ...props,
    queryFn: async ({ pageParam: cursor }) => {
      const res = await queryFn(cursor);
      return res.success ? res.data : [];
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage: any) => lastPage?.cursor,
    placeholderData: (previousData) => previousData,
    select: (data) => data?.pages.flatMap((page) => page.items) ?? [],
  });

  //const items = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);
  const hasContent = useMemo(() => data?.length > 0, [data?.length]);
  return {
    ...query,
    data,
    hasContent,
    fetchNextPage,
  };
}
