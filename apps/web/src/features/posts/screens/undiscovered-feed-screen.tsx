import { Sprout } from 'lucide-react';
import { apiService } from '../../../utils/api/api-service';
import { PostFeedScreen } from './feed-screen';

export function UndiscoveredFeedScreen() {
  return (
    <PostFeedScreen
      icon={<Sprout />}
      title="Undiscovered"
      description='Browse tracks that have not yet hit their unique listeners threshold.'
      queryFn={async (genres, moods, cursor) => await apiService.getDiscoveryFeed(cursor, genres, moods)}
      queryKey={['feed', 'undiscovered']}
    />
  );
}
