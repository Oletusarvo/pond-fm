import { Post } from '../components/post';
import { PostProvider } from '../providers/post-provider';
import { Separator } from '../../../components/separator';
import { TagList } from '../components/tag-list';
import { useDiscoveryFeed } from '../hooks/use-discovery-feed';
import { useEffect, useState } from 'react';
import { TippingProvider } from '../../tipping/providers/tipping-provider';
import { RepostProvider } from '../providers/repost-provider';
import { Spinner } from '../../../components/spinner';

export function DiscoveryFeedScreen() {
  const { data, isPending, nextPageTriggerRef } = useDiscoveryFeed();
  const [selectedTag, setSelectedTag] = useState(null);

  if (isPending) {
    return <Spinner />;
  }

  return (
    <div className='flex flex-col w-full max-h-full'>
      <div className='py-2 h-pad'>
        <TagList
          onTagSelected={tag => setSelectedTag(tag)}
          selectedTag={selectedTag}
          tags={['Electronic', 'Ambient', 'Rock', 'Metal', 'Rap', 'Hip-Hop', 'Industrial', 'EBM']}
        />
      </div>
      <Separator />
      <div className='flex flex-col w-full flex-1 overflow-y-scroll'>
        {!isPending ? (
          <>
            {data.map((post, i) => {
              return (
                <PostProvider initialPost={post}>
                  <TippingProvider
                    recipient={post.track.author}
                    key={post.id}>
                    <RepostProvider track={post.track}>
                      <Post />
                    </RepostProvider>
                  </TippingProvider>

                  {i < data.length - 1 ? <Separator /> : null}
                </PostProvider>
              );
            })}

            <div
              ref={nextPageTriggerRef}
              id='infinte-scroll-sentinel'
              className='h-1 bg-slate-100 w-full flex shrink-0'
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
