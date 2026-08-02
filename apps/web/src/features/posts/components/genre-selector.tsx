import React, { useEffect, useMemo } from 'react';
import { genreMap } from '../../../utils/genre-map';
import { useGenreSelector } from '../hooks/use-genre-selector';
import { TagList } from './tag-list';

type GenreSelectorProps = Parameters<typeof useGenreSelector>[0];

export const GenreSelector = React.memo(function GenreSelector(props: GenreSelectorProps) {
  const genreSelector = useGenreSelector(props);
  const mainGenres = useMemo(() => Object.keys(genreMap), []);
  const styles = useMemo(() => genreMap[genreSelector.mainGenre], [genreSelector.mainGenre]);

  return (
    <div className='flex flex-col gap-1'>
      <TagList
        tags={mainGenres}
        selectedTags={[genreSelector.mainGenre]}
        onTagSelected={tag => genreSelector.updateMainGenre(tag)}
      />
      <TagList
        color='secondary'
        tags={styles}
        selectedTags={genreSelector.styles}
        onTagSelected={tag => genreSelector.updateStyles(tag)}
      />
    </div>
  );
});
