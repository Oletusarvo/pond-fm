import React from 'react';
import { useClassName } from '../../../hooks/use-class-name';
import { usePostContext } from '../providers/post-provider';
import { genreMap } from '../../../utils/genre-map';
import { Tag } from './tag';

const tagColorMap = {
  electronic: {
    selected: 'bg-yellow-500/20 text-yellow-900 border-transparent',
    unselected: 'bg-transparent border border-yellow-500 text-yellow-500',
  },
  ambient: {
    selected: 'bg-fuchsia-500/20 text-fuchsia-900 border-transparent',
    unselected: 'bg-transparent border border-fuchsia-500 text-fuchsia-500',
  },
  rap: {
    selected: 'bg-red-800/20 text-red-900 border-transparent',
    unselected: 'border-red-800 text-red-800 bg-transparent',
  },
  'hip-Hop': {
    selected: 'bg-amber-800/20 text-amber-900 border-transparent',
    unselected: 'border-amber-800 text-amber-800 bg-transparent',
  },
  metal: {
    selected: 'bg-slate-700/20 text-slate-900 border-transparent',
    unselected: 'border-slate-700 text-slate-700 bg-transparent',
  },
  industrial: {
    selected: 'bg-gray-800/20 text-gray-900 border-transparent',
    unselected: 'border-gray-800 text-gray-800 bg-transparent',
  },
  ebm: {
    selected: 'bg-purple-800/20 text-purple-900 border-transparent',
    unselected: 'border-purple-800 text-purple-800 bg-transparent',
  },
  rock: {
    selected: 'bg-red-500/20 text-red-900 border-transparent',
    unselected: 'border-red-500 text-red-500 bg-transparent',
  },
  techno: {
    selected: 'bg-blue-500/20 text-blue-900 border-transparent',
    unselected: 'border-blue-500 text-blue-500 bg-transparent',
  },
};

type TagListProps = {
  tags: string[];
  onTagSelected?: (tag: string) => void;
  selectedTags?: string[];
  color?: React.ComponentProps<typeof Tag>['color'];
};

export function TagList({ tags, onTagSelected, selectedTags, color = 'primary' }: TagListProps) {
  return (
    <div className='flex items-center gap-2 max-w-full shrink-0 no-scrollbar'>
      {tags.map(tag => {
        return (
          <Tag
            key={tag}
            color={color}
            value={tag}
            onSelected={onTagSelected}
            selected={selectedTags?.includes(tag)}
          />
        );
      })}
    </div>
  );
}
