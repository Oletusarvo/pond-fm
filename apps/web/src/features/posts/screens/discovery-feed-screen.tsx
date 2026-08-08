import { apiService } from '../../../utils/api-service';
import { usePostStore } from '../hooks/use-post';
import { PostFeedScreen } from './feed-screen';

export function UndiscoveredFeedScreen() {
  return (
    <PostFeedScreen
      title="Undiscovered"
      description='Browse tracks with less than 100 unique listeners.'
      queryFn={async (genres, moods, cursor) => await apiService.getDiscoveryFeed(cursor, genres, moods)}
      queryKey={['feed', 'undiscovered']}
    />
  );
}
