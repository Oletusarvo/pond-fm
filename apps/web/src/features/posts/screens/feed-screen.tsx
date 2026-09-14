import React, {
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
  useTransition,
} from "react";
import { Separator } from "../../../components/separator";
import { PostFeed } from "../components/post-feed";
import { PostFeedScreenContainer } from "../components/post-feed-screen-container";
import { PostFeedHeader } from "../components/post-feed-header";
import { GenreSelector } from "../components/genre-selector";
import { FeedProvider } from "../../../providers/feed-provider";
import { UseInfiniteFeedProps } from "../../../hooks/use-infinite-feed";
import { useLocalStorageState } from "../../../hooks/use-local-storage";
import { setupContext } from "../../../utils/setup-context";
import { debounce } from "../../../utils/debounce";

/**Context for the genre and mood query values, to stop the GenreSelector from re-rendering and lagging when they are updated. */
const [QueryValuesContext, useQueryValuesContext] = setupContext<{
  moods: string[];
  genres: string[];
}>({ name: "QueryValuesContext" });

/**Query setter context for the GenreSelector, so it isn't re-rendered when the query values change. */
const [QuerySetterContext, useQuerySetterContext] = setupContext<{
  setQueryMoods: React.Dispatch<SetStateAction<string[]>>;
  setQueryGenres: React.Dispatch<SetStateAction<string[]>>;
}>({ name: "QuerySetterContext" });

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

/**Renders a feed screen. */
export function PostFeedScreen({
  title,
  description,
  queryFn,
  queryKey,
  icon,
}: FeedScreenProps) {
  const [queryGenres, setQueryGenres] = useState([]);
  const [queryMoods, setQueryMoods] = useState([]);

  const queryKeyMemoed = useMemo(() => {
    return [
      ...queryKey,
      ...queryGenres.sort().join(";"),
      ...queryMoods.sort().join(";"),
    ];
  }, [queryGenres, queryMoods, queryKey]);

  return (
    <PostFeedScreenContainer>
      <PostFeedHeader icon={icon} title={title} description={description}>
        <QuerySetterContext.Provider
          value={{
            setQueryGenres,
            setQueryMoods,
          }}
        >
          <GenreSelectorSection />
        </QuerySetterContext.Provider>
      </PostFeedHeader>

      <Separator />
      <QueryValuesContext.Provider
        value={{
          genres: queryGenres,
          moods: queryMoods,
        }}
      >
        <FeedSection queryFn={queryFn} queryKey={queryKeyMemoed} />
      </QueryValuesContext.Provider>
    </PostFeedScreenContainer>
  );
}

function FeedSection({ queryFn, queryKey }) {
  const { genres, moods } = useQueryValuesContext();
  return (
    <FeedProvider
      queryFn={(cursor?: string) => queryFn(genres, moods, cursor as string)}
      queryKey={queryKey}
    >
      <PostFeed />
    </FeedProvider>
  );
}

function GenreSelectorSection() {
  const [transition, startTransition] = useTransition();
  const { value: selectedGenres, setState: setGenres } = useLocalStorageState(
    ["genres"],
    [],
  );
  const { value: selectedMoods, setState: setMoods } = useLocalStorageState(
    ["moods"],
    [],
  );
  const { setQueryGenres, setQueryMoods } = useQuerySetterContext();
  const queryDelay = 800;
  const updateQueryGenres = debounce(
    (genres) =>
      startTransition(() => {
        setQueryGenres(genres);
        setGenres(genres);
      }),
    queryDelay,
  );
  const updateQueryMoods = debounce(
    (moods) =>
      startTransition(() => {
        setQueryMoods(moods);
        setMoods(moods);
      }),
    queryDelay,
  );
  return (
    <GenreSelector
      initialGenres={selectedGenres}
      initialMoods={selectedMoods}
      onGenresChanged={updateQueryGenres}
      onMoodsChanged={updateQueryMoods}
    />
  );
}
