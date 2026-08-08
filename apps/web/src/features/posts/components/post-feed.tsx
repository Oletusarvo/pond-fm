import { useInfiniteQuery } from '@tanstack/react-query';
import { TippingProvider } from '../../tipping/providers/tipping-provider';
import { useInfiniteFeed } from '../../../hooks/use-infinite-feed';
import { usePostStore } from '../hooks/use-post';
import { useUpdateStore } from '../hooks/use-update-store';
import { PostProvider } from '../providers/post-provider';
import { Feed } from '../../../components/feed';
import { Post } from './post';
import { FeedProvider } from '../../../providers/feed-provider';
import { PopulatePostStore } from '../providers/populates-post-store';

export function PostFeed() {
  return (
    <PopulatePostStore>
      <Feed
        keyExtractor={item => item?.id}
        renderComponent={({ item }) => {
          if (!item) return null;
          return (
            <PostProvider id={item.id}>
              <TippingProvider recipient={item.track.author}>
                <Post />
              </TippingProvider>
            </PostProvider>
          );
        }}
      />
    </PopulatePostStore>

  );
}
