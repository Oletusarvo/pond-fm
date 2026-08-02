import { useState, useTransition } from 'react';

type GenreSelectorProps = {
  styleLimit?: number;
  onMainGenreChanged?: (genre: string) => void;
  onStylesChanged?: (styles: string[]) => void;
};

export function useGenreSelector({
  styleLimit,
  onMainGenreChanged,
  onStylesChanged,
}: GenreSelectorProps = {}) {
  const [mainGenre, setMainGenre] = useState('electronic');
  const [styles, setStyles] = useState<string[]>([]);

  const updateStyles = (tag: string) => {
    const nextStyles = styles.includes(tag)
      ? styles.filter(t => t != tag)
      : styleLimit && styles.length + 1 > styleLimit
        ? styles
        : [...styles, tag];
    setStyles(nextStyles);
    onStylesChanged?.(nextStyles);
  };

  const updateMainGenre = (tag: string) => {
    if (tag !== mainGenre) {
      setMainGenre(tag);
      setStyles([]);
      onMainGenreChanged?.(tag);
    }
  };

  return {
    mainGenre,
    styles,
    updateMainGenre,
    updateStyles,
  };
}
