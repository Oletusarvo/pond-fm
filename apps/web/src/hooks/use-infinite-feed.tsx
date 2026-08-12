import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

type UseFeedProps = Omit<Parameters<typeof useInfiniteQuery>[0], 'initialPageParam' | 'getNextPageParam' | 'placeholderData' | 'queryFn'> & {
  queryFn: (cursor?: string) => Promise<Response>;
};

export function useInfiniteFeed({ queryFn, ...props }: UseFeedProps) {
  const { data, fetchNextPage, ...query } = useInfiniteQuery({
    ...props,
    queryFn: async ({ pageParam: cursor }) => {
      const res = await queryFn(cursor);
      return res.ok ? await res.json() : [];
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage: any) => lastPage?.cursor,
    placeholderData: previousData => previousData,
    select: data => data?.pages.flatMap(page => page.items) ?? [],
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
