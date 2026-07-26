import React from 'react';
import { useClassName } from '../../../hooks/use-class-name';
import { usePostContext } from '../providers/post-provider';

const tagColorMap = {
  Electronic: {
    selected: 'bg-yellow-500/20 text-yellow-500 border-transparent',
    unselected: 'bg-transparent border border-yellow-500 text-yellow-500',
  },
  Ambient: {
    selected: 'bg-fuchsia-500/20 text-fuchsia-500 border-transparent',
    unselected: 'bg-transparent border border-fuchsia-500 text-fuchsia-500',
  },
  Rap: {
    selected: 'bg-red-800/20 text-red-800 border-transparent',
    unselected: 'border-red-800 text-red-800 bg-transparent',
  },
  'Hip-Hop': {
    selected: 'bg-amber-800/20 text-amber-800 border-transparent',
    unselected: 'border-amber-800 text-amber-800 bg-transparent',
  },
  Metal: {
    selected: 'bg-slate-700/20 text-slate-700 border-transparent',
    unselected: 'border-slate-700 text-slate-700 bg-transparent',
  },
  Industrial: {
    selected: 'bg-gray-800/20 text-gray-800 border-transparent',
    unselected: 'border-gray-800 text-gray-800 bg-transparent',
  },
  EBM: {
    selected: 'bg-purple-800/20 text-purple-800 border-transparent',
    unselected: 'border-purple-800 text-purple-800 bg-transparent',
  },
  Rock: {
    selected: 'bg-red-500/20 text-red-500 border-transparent',
    unselected: 'border-red-500 text-red-500 bg-transparent',
  },
};

type TagListProps = {
  tags: string[];
  onTagSelected?: (tag: string) => void;
  selectedTag?: string;
};
export const TagList = React.memo(function TagList({
  tags,
  onTagSelected,
  selectedTag,
}: TagListProps) {
  return (
    <div className='flex items-center gap-2 max-w-full shrink-0 no-scrollbar'>
      {tags.map(tag => {
        const colorConfig = tagColorMap[tag];
        const className = useClassName(
          'rounded-[100px] py-1 px-2 font-semibold text-xs text-center shrink-0 border',
          onTagSelected ? 'cursor-pointer' : '',
          selectedTag === tag
            ? colorConfig?.selected || 'bg-primary/20 text-primary border-transparent'
            : colorConfig?.unselected || 'boder-primary text-primary',
        );

        return (
          <div
            onClick={() => onTagSelected?.(tag)}
            className={className}
            key={tag}>
            {tag}
          </div>
        );
      })}
    </div>
  );
});
