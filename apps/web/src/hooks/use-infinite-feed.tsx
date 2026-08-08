import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

type UseFeedProps = {
  queryFn: (cursor?: string) => Promise<Response>;
  queryKey: Parameters<typeof useInfiniteQuery>[0]['queryKey'];
  enabled?: boolean;
};

export function useInfiniteFeed({ queryFn, queryKey: key, enabled }: UseFeedProps) {
  const { data, fetchNextPage, ...query } = useInfiniteQuery({
    queryKey: key,
    queryFn: async ({ pageParam: cursor }) => {
      const res = await queryFn(cursor);
      return res.ok ? await res.json() : [];
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage: any) => lastPage?.cursor,
    placeholderData: previousData => previousData,
    enabled,
  });

  const items = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);
  const hasContent = useMemo(() => items.length > 0, [items.length]);
  return {
    ...query,
    data: items,
    hasContent,
    fetchNextPage,
  };
}
