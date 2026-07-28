import { useState } from 'react';
import { Spinner } from '../../../components/spinner';
import { useInfiniteFeed } from '../hooks/use-infinite-feed';
import { TagList } from './tag-list';
import { Separator } from '../../../components/separator';
import { PostProvider } from '../providers/post-provider';
import { TippingProvider } from '../../tipping/providers/tipping-provider';
import { Post } from './post';
import React from 'react';
import { LoadingFiller } from '../../../components/loading-filler';

type FeedScreenProps = {
  queryHook: () => ReturnType<typeof useInfiniteFeed>;
};
export function Feed({ queryHook }: FeedScreenProps) {
  const { data, isPending, nextPageTriggerRef } = queryHook();

  if (isPending) {
    return <LoadingFiller />;
  }

  if (!data.length) {
    return (
      <div className='flex w-full flex-1 h-full justify-center'>
        <span className='text-slate-500'>No tracks found.</span>
      </div>
    );
  }

  return (
    <div className='flex flex-col w-full flex-1 overflow-y-scroll'>
      {!isPending ? (
        <>
          {data.map((post, i) => {
            return (
              <React.Fragment key={post.id}>
                <PostProvider initialPost={post}>
                  <TippingProvider recipient={post.track.author}>
                    <Post />
                  </TippingProvider>
                </PostProvider>
                {i < data.length - 1 ? <Separator /> : null}
              </React.Fragment>
            );
          })}

          <div
            ref={nextPageTriggerRef}
            id='infinte-scroll-sentinel'
          />
        </>
      ) : null}
    </div>
  );
}
