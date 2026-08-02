import { TippingProvider } from '../../tipping/providers/tipping-provider';
import { PostProvider } from '../providers/post-provider';
import { Feed } from './feed';
import { Post } from './post';

export function PostFeed() {
  return (
    <Feed
      keyExtractor={item => item.id}
      renderComponent={({ item }) => {
        return (
          <PostProvider initialPost={item}>
            <TippingProvider recipient={item.track.author}>
              <Post />
            </TippingProvider>
          </PostProvider>
        );
      }}
    />
  );
}
