import React, { ReactNode, useState, useTransition } from "react";
import { Separator } from "../../../components/separator";
import { PostFeed } from "../components/post-feed";
import { PostFeedScreenContainer } from "../components/post-feed-screen-container";
import { PostFeedHeader } from "../components/post-feed-header";
import { GenreSelector } from "../components/genre-selector";
import { FeedProvider } from "../../../providers/feed-provider";
import {
  useInfiniteFeed,
  UseInfiniteFeedProps,
} from "../../../hooks/use-infinite-feed";
import { useLocalStorage } from "../../../hooks/use-local-storage";

type FeedScreenProps = {
  title: string;
  description?: string;
  queryFn: (
    genres: string[],
    moods: string[],
    cursor?: string,
  ) => ReturnType<UseInfiniteFeedProps["queryFn"]>;
  queryKey: string[];
  icon?: ReactNode;
};
export function PostFeedScreen({
  title,
  description,
  queryFn,
  queryKey,
  icon,
}: FeedScreenProps) {
  const { value: genres, updateLocalStorage: updateGenres } = useLocalStorage(
    ["genres"],
    [],
  );
  const { value: moods, updateLocalStorage: updateMoods } = useLocalStorage(
    ["moods"],
    [],
  );
  const [transition, startTransition] = useTransition();
  console.log(genres, moods, ["electronic"]);
  return (
    <PostFeedScreenContainer>
      <PostFeedHeader icon={icon} title={title} description={description}>
        <GenreSelector
          initialGenres={genres}
          initialMoods={moods}
          onGenresChanged={(g) => startTransition(() => updateGenres(g))}
          onMoodsChanged={(s) =>
            startTransition(() => {
              updateMoods(s);
            })
          }
        />
      </PostFeedHeader>

      <Separator />
      <FeedProvider
        queryFn={(cursor?: string) => queryFn(genres, moods, cursor as string)}
        queryKey={[
          ...queryKey,
          genres.sort().join(";"),
          moods.sort().join(";"),
        ]}
      >
        <PostFeed />
      </FeedProvider>
    </PostFeedScreenContainer>
  );
}
