import { Check, Sparkles } from 'lucide-react';

import React from 'react';
import { useToggleContext } from '../../../providers/toggle-provider';
import { Modal } from '../../../components/modal';
import { Button, LoaderButton } from '../../../components/button';
import { useUpgradeSubscription } from '../hooks/use-upgrade-subscription';

type GoProModalProps = {
  onUpgrade?: () => void;
};

const PRO_FEATURES = [
  'Your tracks appear in the undiscovered feed until they have accumulated 100 unique listeners (up from 25)',
  '5GB of storage (up from 150MB)',
  'No ads, ever',
] as const;

export const GoProModal = React.memo(function GoProModal({
  onUpgrade,
}: GoProModalProps) {
  const { toggleState } = useToggleContext();
  const onClose = () => toggleState(false);

  return (
    <Modal onClose={onClose} title='Go Pro'>
      <ModalContent />
    </Modal>
  );
});

function ModalContent() {
  const { toggleState } = useToggleContext();
  const onClose = () => toggleState(false);
  const { upgradeSubscription, loading, status } = useUpgradeSubscription({
    onSuccess: async res => {
      const result = await res.json();
      window.location.href = result.checkoutUrl;
    }
  });

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex items-start gap-3'>
        <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white'>
          <Sparkles size={18} />
        </div>
        <div>
          <p className='text-2xl font-semibold leading-tight'>
            5€<span className='text-sm font-normal text-slate-500'>/month</span>
          </p>
          <p className='text-sm text-slate-500'>Billed annually</p>
        </div>
      </div>

      <ul className='flex flex-col gap-3'>
        {PRO_FEATURES.map((feature) => (
          <li key={feature} className='flex items-center gap-2 text-sm text-slate-700'>
            <Check size={16} className='shrink-0 text-black' />
            {feature}
          </li>
        ))}
      </ul>

      <p className='text-xs text-slate-400'>
        Full refund if you cancel within 14 days. Cancel later and you'll keep Pro
        until your plan expires.
      </p>

      <div className='flex flex-col gap-2'>
        <LoaderButton onClick={upgradeSubscription} variant='contained' paddingEnabled shape='rounded' loading={loading} disabled={loading || status === 'success'}>
          Upgrade to Pro
        </LoaderButton>
        <Button onClick={onClose} variant='ghost' paddingEnabled shape='rounded'>
          Maybe later
        </Button>
      </div>
    </div>
  )
}