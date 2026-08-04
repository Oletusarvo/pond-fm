import { apiService } from '../../../utils/api-service';
import { FeedScreen } from './feed-screen';

export function MainScreenFeed() {
  return (
    <FeedScreen
      title="New"
      description='Discover the newest tracks to hit the pond.'
      queryFn={async (genres, moods, cursor) => await apiService.getMainFeed(cursor, genres, moods)}
      queryKey={['feed', 'new']} />
  );
}
