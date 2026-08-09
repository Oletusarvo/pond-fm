import { useState, useTransition } from 'react';
import { Separator } from '../../../components/separator';
import { PostFeed } from '../components/post-feed';
import { PostFeedScreenContainer } from '../components/post-feed-screen-container';
import { PostFeedHeader } from '../components/post-feed-header';
import { GenreSelector } from '../components/genre-selector';
import { FeedProvider } from '../../../providers/feed-provider';

type FeedScreenProps = {
  title: string;
  description?: string;
  queryFn: (genres: string[], moods: string[], cursor?: string) => Promise<Response>;
  queryKey: string[];
}
export function PostFeedScreen({
  title, description, queryFn, queryKey
}: FeedScreenProps) {
  const [genres, setMainGenre] = useState([]);
  const [moods, setMoods] = useState([]);
  const [transition, startTransition] = useTransition();

  return (
    <PostFeedScreenContainer>
      <PostFeedHeader
        title={title}
        description={description}>
        <GenreSelector
          onGenresChanged={g => startTransition(() => setMainGenre(g))}
          onMoodsChanged={s => startTransition(() => { setMoods(s) })} />
      </PostFeedHeader>

      <Separator />
      <FeedProvider
        queryFn={(cursor?: string) => queryFn(genres, moods, cursor as string)}
        queryKey={[...queryKey, genres.sort().join(';'), moods.sort().join(';')]}>
        <PostFeed />
      </FeedProvider>
    </PostFeedScreenContainer >
  );
}
