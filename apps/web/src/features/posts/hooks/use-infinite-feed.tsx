import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

type UseFeedProps = {
  queryFn: (config: { pageParam?: string }) => Promise<any>;
  key: string[];
  enabled?: boolean;
};

export function useInfiniteFeed({ queryFn, key, enabled }: UseFeedProps) {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const { data, fetchNextPage, ...query } = useInfiniteQuery({
    queryKey: key,
    queryFn,
    initialPageParam: undefined,
    getNextPageParam: lastPage => lastPage?.cursor,
    placeholderData: previousData => previousData,
    enabled,
  });

  const items = useMemo(() => data?.pages.flatMap(page => page.items) ?? [], [data]);
  const hasContent = useMemo(() => items.length > 0, [items.length]);

  useEffect(() => {
    if (inView && query.hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  return {
    ...query,
    data: items,
    hasContent,
    nextPageTriggerRef: ref,
  };
}
