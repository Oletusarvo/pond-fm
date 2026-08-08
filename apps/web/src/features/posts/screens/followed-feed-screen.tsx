import { apiService } from '../../../utils/api-service';
import { PostFeedScreen } from './feed-screen';

export function FollowedFeedScreen() {
  return (
    <PostFeedScreen
      title="Followed"
      description='Discover the newest tracks by users you follow.'
      queryFn={async (genres, moods, cursor) => await apiService.getFollowedFeed(cursor, genres, moods)}
      queryKey={['feed', 'followed']} />
  );
}
