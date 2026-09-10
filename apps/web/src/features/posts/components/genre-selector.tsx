import React, { useEffect, useMemo } from "react";
import { genreMap } from "../../../utils/genre-map";
import { useGenreSelector } from "../hooks/use-genre-selector";
import { TagList } from "./tag-list";
import { useMainGenres } from "../hooks/use-main-genres";
import { useMoods } from "../hooks/use-moods";
import { useToggleList } from "../../../hooks/use-toggle-list";

type GenreSelectorProps = Parameters<typeof useGenreSelector>[0];

/**Renders a selector for genres and moods. */
export const GenreSelector = React.memo(function GenreSelector(
  props: GenreSelectorProps,
) {
  return (
    <div className='flex flex-col gap-1'>
      <GenreFilter onChange={props.onGenresChanged} />
      <MoodFilter onChange={props.onMoodsChanged} />
    </div>
  );
});

function GenreFilter({ onChange }) {
  const { items, toggleItem } = useToggleList<string>({
    onChanged: (genres) => onChange(genres),
  });
  const { data: genres, isPending: genresPending } = useMainGenres();

  return (
    <TagList
      tags={genres || []}
      selectedTags={items}
      onTagSelected={(tag) => toggleItem(tag)}
    />
  );
}

function MoodFilter({ onChange }) {
  const { items, toggleItem } = useToggleList<string>({
    onChanged: (moods) => onChange(moods),
  });
  const { data: moods, isPending: moodsPending } = useMoods();
  return (
    <TagList
      color='secondary'
      tags={moods || []}
      selectedTags={items}
      onTagSelected={(tag) => toggleItem(tag)}
    />
  );
}
