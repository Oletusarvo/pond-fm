import { apiService } from '../../../utils/api-service';
import { FeedScreen } from './feed-screen';

export function UndiscoveredFeedScreen() {
  return (
    <FeedScreen
      title="Undiscovered"
      description='Browse tracks with less than 100 unique listeners.'
      queryFn={async (genres, moods, cursor) => await apiService.getDiscoveryFeed(cursor, genres, moods)}
      queryKey={['feed', 'undiscovered']} />
  );
}
