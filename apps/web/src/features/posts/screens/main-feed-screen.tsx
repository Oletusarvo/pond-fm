import { Rss } from 'lucide-react';
import { apiService } from '../../../utils/api/api-service';
import { usePostStore } from '../hooks/use-post';
import { PostFeedScreen } from './feed-screen';

export function MainScreenFeed() {
  return (
    <PostFeedScreen
      icon={<Rss />}
      title="New"
      description='Discover the newest tracks to hit the pond.'
      queryFn={async (genres, moods, cursor) => await apiService.getMainFeed(cursor, genres, moods)}
      queryKey={['feed', 'new']} />
  );
}
