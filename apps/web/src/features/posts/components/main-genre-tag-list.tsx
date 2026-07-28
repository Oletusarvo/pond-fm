import { TagList } from './tag-list';

const mainGenreTags = [
  'Electronic',
  'Rock',
  'Metal',
  'Rap',
  'Hip-Hop',
  'Ambient',
  'Experimental',
  'Techno',
  'Trance',
  'EBM',
  'Industrial',
  'Noise',
];

export function MainGenreTagList({ selectedTag, onSelected }) {
  return (
    <TagList
      tags={mainGenreTags}
      selectedTag={selectedTag}
      onTagSelected={onSelected}
    />
  );
}
