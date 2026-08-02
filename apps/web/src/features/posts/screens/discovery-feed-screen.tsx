import { useState, useTransition } from 'react';
import { Separator } from '../../../components/separator';
import { PostFeed } from '../components/post-feed';
import { FeedProvider } from '../../../providers/feed-provider';
import { PostFeedScreenContainer } from '../components/post-feed-screen-container';
import { PostFeedHeader } from '../components/post-feed-header';
import { GenreSelector } from '../components/genre-selector';
import { apiService } from '../../../utils/api-service';

export function UndiscoveredFeedScreen() {
  const [mainGenre, setMainGenre] = useState(null);
  const [transition, startTransition] = useTransition();

  return (
    <PostFeedScreenContainer>
      <PostFeedHeader
        title='Undiscovered tracks'
        description='Discover tracks with less than 100 unique listeners.'>
        <GenreSelector onMainGenreChanged={genre => setMainGenre(genre)} />
      </PostFeedHeader>

      <Separator />
      <FeedProvider
        queryFn={(cursor?: string) => apiService.getDiscoveryFeed(cursor, mainGenre)}
        queryKey={['feed', 'undiscovered', mainGenre]}>
        <PostFeed />
      </FeedProvider>
    </PostFeedScreenContainer>
  );
}
