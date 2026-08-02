import { useCallback, useState, useTransition } from 'react';
import { Separator } from '../../../components/separator';
import { PostFeed } from '../components/post-feed';
import { FeedProvider } from '../../../providers/feed-provider';
import { PostFeedScreenContainer } from '../components/post-feed-screen-container';
import { PostFeedHeader } from '../components/post-feed-header';
import { GenreSelector } from '../components/genre-selector';
import { apiService } from '../../../utils/api-service';

export function MainScreenFeed() {
  const [mainGenre, setMainGenre] = useState(null);
  const [transition, startTransition] = useTransition();
  const updateMainGenre = useCallback(
    (genre: string) => {
      startTransition(() => setMainGenre(genre));
    },
    [setMainGenre, startTransition],
  );

  return (
    <PostFeedScreenContainer>
      <PostFeedHeader
        title='New'
        description='Recently uploaded or reposted tracks in chronological order.'>
        <GenreSelector onMainGenreChanged={updateMainGenre} />
      </PostFeedHeader>

      <Separator></Separator>
      <FeedProvider
        queryFn={cursor => apiService.getMainFeed(cursor, mainGenre)}
        queryKey={['feed', 'main', mainGenre]}>
        <PostFeed />
      </FeedProvider>
    </PostFeedScreenContainer>
  );
}
