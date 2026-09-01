import { useState } from "react";
import { useToggleList } from "../../../hooks/use-toggle-list";
import { useMainGenres } from "../hooks/use-main-genres";
import { useMoods } from "../hooks/use-moods";
import { TagList } from "./tag-list";

export function GenreSelector({ onChange, defaultSelected = null }) {
  const [selectedGenre, setSelectedGenre] = useState(defaultSelected);
  const { data: genres, isPending: genresPending } = useMainGenres();
  const onGenreSelected = (genre: string) => {
    setSelectedGenre(genre);
    onChange(genre)
  }
  return (
    <TagList selectedTags={[selectedGenre]} tags={genres || []} onTagSelected={onGenreSelected} />
  );
}

export function MoodSelector({ defaultSelected = null, onChange }) {
  const { items: selectedMoods, toggleItem: toggleMood } = useToggleList<string>({
    initialItems: defaultSelected,
    limit: 3,
    onChanged: (items) => onChange(items)
  });

  const { data: moods, isPending: moodsPending } = useMoods();

  return (
    <TagList tags={moods || []} selectedTags={selectedMoods} onTagSelected={tag => toggleMood(tag)} color="secondary" />
  )
}