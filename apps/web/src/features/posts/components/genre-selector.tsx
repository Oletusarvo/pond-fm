import React, { useEffect, useMemo } from "react";
import { genreMap } from "../../../utils/genre-map";
import { useGenreSelector } from "../hooks/use-genre-selector";
import { TagList } from "./tag-list";
import { useMainGenres } from "../hooks/use-main-genres";
import { useMoods } from "../hooks/use-moods";
import { useToggleList } from "../../../hooks/use-toggle-list";

type GenreSelectorProps = Parameters<typeof useGenreSelector>[0];

/**Renders a selector for genres and moods. */
export const GenreSelector = React.memo(function GenreSelector({
  onGenresChanged,
  onMoodsChanged,
  initialGenres,
  initialMoods,
}: GenreSelectorProps) {
  return (
    <div className='flex flex-col gap-1'>
      <GenreFilter onChange={onGenresChanged} initialGenres={initialGenres} />
      <MoodFilter onChange={onMoodsChanged} initialMoods={initialMoods} />
    </div>
  );
});

function GenreFilter({ onChange, initialGenres }) {
  const { items, toggleItem } = useToggleList<string>({
    initialItems: initialGenres,
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

function MoodFilter({ onChange, initialMoods }) {
  const { items, toggleItem } = useToggleList<string>({
    initialItems: initialMoods,
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
