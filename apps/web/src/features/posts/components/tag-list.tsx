import React from 'react';
import { useClassName } from '../../../hooks/use-class-name';
import { usePostContext } from '../providers/post-provider';
import { genreMap } from '../../../utils/genre-map';
import { Tag } from './tag';

type TagListProps = {
  tags: string[];
  onTagSelected?: (tag: string) => void;
  selectedTags?: string[];
  color?: React.ComponentProps<typeof Tag>['color'];
  size?: React.ComponentProps<typeof Tag>['size'];
};

export function TagList({ tags, onTagSelected, selectedTags, color = 'primary', size }: TagListProps) {
  return (
    <div className='flex items-center gap-2 max-w-full shrink-0 no-scrollbar'>
      {tags?.map(tag => {
        return (
          <Tag
            size={size}
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
