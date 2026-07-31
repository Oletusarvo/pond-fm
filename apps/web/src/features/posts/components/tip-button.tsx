import { Coins } from 'lucide-react';
import { Button } from '../../../components/button';
import { useTippingContext } from '../../tipping/providers/tipping-provider';

export function TipButton() {
  const { showTippingModal } = useTippingContext();
  return (
    <Button
      variant='ghost'
      onClick={showTippingModal}>
      <div className='flex items-center gap-2'>
        <Coins
          size='1rem'
          style={{
            color: 'var(--color-primary)',
          }}
        />
        <span className='text-sm text-primary'>Tip Artist</span>
      </div>
    </Button>
  );
}
