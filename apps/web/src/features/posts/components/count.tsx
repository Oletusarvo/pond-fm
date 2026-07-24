import { useMemo } from 'react';
import { usePostContext } from '../providers/post-provider';
import { Button } from '../../../components/button';

export function Count({
  icon: Icon,
  value,
  ...props
}: { icon: React.FC<any>; value: number } & Pick<React.ComponentProps<'button'>, 'onClick'>) {
  const post = usePostContext();
  const convertedCount = useMemo(() => {
    const rawCount = value >= 1000 ? value / 1000 : value >= 1000000 ? value / 1000000 : value;
    const roundedCount = Math.round(rawCount * 100) / 100;
    const postFix = value >= 1000 ? 'k' : value >= 1000000 ? 'm' : '';
    return `${roundedCount.toLocaleString('fi')}${postFix}`;
  }, [value]);

  return (
    <Button
      {...props}
      variant='ghost'>
      <div className='flex gap-2 items-center text-sm'>
        <Icon
          size='1rem'
          className='text-primary text-sm'
        />
        <span>{convertedCount}</span>
      </div>
    </Button>
  );
}
