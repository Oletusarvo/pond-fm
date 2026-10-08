import { useRef, useState, useTransition } from "react";
import { useToggleList } from "../../../hooks/use-toggle-list";

type GenreSelectorProps = {
  initialGenres?: string[];
  initialMoods?: string[];
  onGenresChanged?: (genre: string[]) => void;
  onMoodsChanged?: (styles: string[]) => void;
  onGenreAdded?: (genre: string) => void;
  onGenreRemoved?: (genre: string) => void;
  onMoodAdded?: (mood: string) => void;
  onMoodRemoved?: (mood: string) => void;
};

export function useGenreSelector({
  initialGenres,
  initialMoods,
  onGenreAdded,
  onGenreRemoved,
  onMoodAdded,
  onMoodRemoved,
  onGenresChanged,
  onMoodsChanged,
}: GenreSelectorProps = {}) {
  const { items: genres, toggleItem: toggleGenre } = useToggleList<string>({
    initialItems: initialGenres,
    onChanged: (genres) => onGenresChanged?.(genres),
  });
  const { items: moods, toggleItem: toggleMood } = useToggleList<string>({
    initialItems: initialMoods,
    onChanged: (moods) => onMoodsChanged?.(moods),
  });

  return {
    genres,
    moods,
    toggleGenre,
    toggleMood,
  };
}
