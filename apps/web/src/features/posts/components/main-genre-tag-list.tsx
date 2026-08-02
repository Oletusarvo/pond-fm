import { genreMap } from '../../../utils/genre-map';
import { TagList } from './tag-list';

export function MainGenreTagList({ selectedTags, onSelected }) {
  return (
    <TagList
      tags={Object.keys(genreMap)}
      selectedTags={selectedTags}
      onTagSelected={onSelected}
    />
  );
}
