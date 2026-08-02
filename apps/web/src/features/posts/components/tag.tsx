import { useClassName } from '../../../hooks/use-class-name';

const tagColorMap = {
  Electronic: {
    selected: 'bg-yellow-500/20 text-yellow-900 border-transparent',
    unselected: 'bg-transparent border border-yellow-500 text-yellow-500',
  },
  Ambient: {
    selected: 'bg-fuchsia-500/20 text-fuchsia-900 border-transparent',
    unselected: 'bg-transparent border border-fuchsia-500 text-fuchsia-500',
  },
  Rap: {
    selected: 'bg-red-800/20 text-red-900 border-transparent',
    unselected: 'border-red-800 text-red-800 bg-transparent',
  },
  'Hip-Hop': {
    selected: 'bg-amber-800/20 text-amber-900 border-transparent',
    unselected: 'border-amber-800 text-amber-800 bg-transparent',
  },
  Metal: {
    selected: 'bg-slate-700/20 text-slate-900 border-transparent',
    unselected: 'border-slate-700 text-slate-700 bg-transparent',
  },
  Industrial: {
    selected: 'bg-gray-800/20 text-gray-900 border-transparent',
    unselected: 'border-gray-800 text-gray-800 bg-transparent',
  },
  EBM: {
    selected: 'bg-purple-800/20 text-purple-900 border-transparent',
    unselected: 'border-purple-800 text-purple-800 bg-transparent',
  },
  Rock: {
    selected: 'bg-red-500/20 text-red-900 border-transparent',
    unselected: 'border-red-500 text-red-500 bg-transparent',
  },
};

type TagProps = {
  value: string;
  onSelected?: (tag: string) => void;
  selected?: boolean;
  color?: 'primary' | 'secondary';
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

export function Tag({ value, onSelected, selected, color }: TagProps) {
  const colorConfig = colorMap[color];
  const className = useClassName(
    'rounded-[100px] py-1 px-2 font-semibold text-xs text-center shrink-0 border',
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
