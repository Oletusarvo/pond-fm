import { useState } from 'react';
import { useClassName } from '../../../hooks/use-class-name';

type TagProps = {
  value: string;
  onSelected?: (tag: string) => void;
  selected?: boolean;
  color?: 'primary' | 'secondary';
  size?: 'default' | 'small';
};

const colorMap: Record<TagProps['color'], Record<'selected' | 'unselected', string>> = {
  primary: {
    selected: 'bg-primary/20 text-green-900 border-transparent',
    unselected: 'boder-primary text-primary',
  },
  secondary: {
    selected: 'bg-slate-500/20 text-slate-900 border-transparent',
    unselected: 'border-slate-500 text-slate-500',
  },
};

export function Tag({ value, onSelected, selected, color = 'primary', size }: TagProps) {
  const colorConfig = colorMap[color];
  const className = useClassName(
    'rounded-[100px] font-semibold text-center shrink-0 border',
    size === 'small' ? 'px-[6px] py-[1px] text-[11px]' : 'px-2 py-1 text-xs',
    onSelected ? 'cursor-pointer' : '',
    selected ? colorConfig.selected : colorConfig.unselected,
  );

  return (
    <div
      onClick={() => onSelected?.(value)}
      className={className}>
      {value}
    </div>
  );
}
