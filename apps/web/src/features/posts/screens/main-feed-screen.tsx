import { apiService } from '../../../utils/api-service';
import { usePostStore } from '../hooks/use-post';
import { PostFeedScreen } from './feed-screen';

export function MainScreenFeed() {
  return (
    <PostFeedScreen
      title="New"
      description='Discover the newest tracks to hit the pond.'
      queryFn={async (genres, moods, cursor) => await apiService.getMainFeed(cursor, genres, moods)}
      queryKey={['feed', 'new']} />
  );
}
