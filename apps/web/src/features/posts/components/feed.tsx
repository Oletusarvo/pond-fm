import { ReactNode, useEffect } from 'react';
import { useInfiniteFeed } from '../hooks/use-infinite-feed';
import { Separator } from '../../../components/separator';
import React from 'react';
import { LoadingFiller } from '../../../components/loading-filler';
import { useFeedContext } from '../../../providers/feed-provider';
import { Sentinel } from '../../../components/sentinel';

type FeedScreenProps = {
  keyExtractor?: (item: any) => string;
  renderComponent: (item: any) => ReactNode;
  onEmptyComponent?: () => ReactNode;
};
export function Feed({
  renderComponent: RenderComponent,
  keyExtractor,
  onEmptyComponent: OnEmptyComponent,
}: FeedScreenProps) {
  const { data, isPending, fetchNextPage } = useFeedContext();

  if (isPending) {
    return <LoadingFiller />;
  }

  if (!data.length) {
    return (
      <div className='flex w-full flex-1 h-full justify-center'>
        {OnEmptyComponent ? (
          <OnEmptyComponent />
        ) : (
          <span className='text-slate-500'>No items.</span>
        )}
      </div>
    );
  }

  return (
    <>
      <div className='flex flex-col w-full flex-1 overflow-y-scroll max-h-full'>
        {!isPending ? (
          <>
            {data.map((item, i) => {
              return (
                <React.Fragment key={keyExtractor?.(item)}>
                  <RenderComponent item={item} />
                  {i < data.length - 1 ? <Separator /> : null}
                </React.Fragment>
              );
            })}
            <Sentinel onVisible={() => fetchNextPage()} />
          </>
        ) : null}
      </div>
    </>
  );
}
