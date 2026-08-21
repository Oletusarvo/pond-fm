import { Network } from 'lucide-react';
import { apiService } from '../../../utils/api/api-service';
import { PostFeedScreen } from './feed-screen';

export function FollowedFeedScreen() {
  return (
    <PostFeedScreen
      icon={<Network />}
      title="Followed"
      description='Discover the newest tracks by users you follow.'
      queryFn={async (genres, moods, cursor) => await apiService.getFollowedFeed(cursor, genres, moods)}
      queryKey={['feed', 'followed']} />
  );
}
