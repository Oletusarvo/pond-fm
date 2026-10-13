import React, { useEffect, useMemo } from "react";
import { genreMap } from "../../../utils/genre-map";
import { useGenreSelector } from "../hooks/use-genre-selector";
import { TagList } from "./tag-list";
import { useMainGenres } from "../hooks/use-main-genres";
import { useMoods } from "../hooks/use-moods";
import { useToggleList } from "../../../hooks/use-toggle-list";
import { HorizontalScrollable } from "../../../components/horizontal-scrollable";

type GenreSelectorProps = Parameters<typeof useGenreSelector>[0];

/**Renders a selector for genres and moods. */
export const GenreSelector = React.memo(function GenreSelector({
  onGenresChanged,
  onMoodsChanged,
  initialGenres,
  initialMoods,
}: GenreSelectorProps) {
  return (
    <div className='flex flex-col gap-3 pt-3'>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <span className='text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500'>
            Genres
          </span>
        </div>
        <HorizontalScrollable>
          <div className='flex items-center gap-2'>
            <GenreFilter onChange={onGenresChanged} initialGenres={initialGenres} />
          </div>
        </HorizontalScrollable>
      </div>

      <div className='flex flex-col gap-2'>
        <div className='flex items-center justify-between'>
          <span className='text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500'>
            Moods
          </span>
        </div>
        <HorizontalScrollable>
          <div className='flex items-center gap-2'>
            <MoodFilter onChange={onMoodsChanged} initialMoods={initialMoods} />
          </div>
        </HorizontalScrollable>
      </div>
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
    <TagList tags={genres || []} selectedTags={items} onTagSelected={(tag) => toggleItem(tag)} />
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
