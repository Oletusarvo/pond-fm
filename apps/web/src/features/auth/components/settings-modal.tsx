import React, { useMemo, useState } from 'react';
import { Check, Crown, Loader2, TriangleAlert, Waves } from 'lucide-react';
import { Modal } from '../../../components/modal';
import { useClassName } from '../../../hooks/use-class-name';
import { Button, LoaderButton } from '../../../components/button';
import { useToggleContext } from '../../../providers/toggle-provider';
import { useAuthContext } from '../providers/auth-provider';
import { Input } from '../../../components/input';
import { useAction } from '../../../hooks/use-action';
import { apiService } from '../../../utils/api/api-service';


/**
 * Assumes `Button` supports `variant` values of 'primary' | 'outline' | 'ghost'
 * and forwards `className`/`disabled`, matching the usage already seen in modal.tsx
 * (`variant='ghost' shape='circle'`). Adjust variant names if the real design
 * system differs.
 */

type Plan = 'free' | 'pro';

type SettingsModalProps = {
  onUsernameChange?: (username: string) => Promise<void> | void;
  /** When the current Pro term started. Required once plan === 'pro'. */
  proPurchasedAt?: Date | null;
  onUpgrade?: () => Promise<void> | void;
  onCancelSubscription?: () => Promise<void> | void;
};

const REFUND_WINDOW_DAYS = 14;
const PLAN_TERM_DAYS = 365;
const MS_PER_DAY = 1000 * 60 * 60 * 24;

function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * MS_PER_DAY);
}

function daysSince(date: Date) {
  return Math.floor((Date.now() - date.getTime()) / MS_PER_DAY);
}

function formatDate(date: Date) {
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export function SettingsModal({
  onUsernameChange,
  proPurchasedAt,
  onUpgrade,
  onCancelSubscription,
}: SettingsModalProps) {
  const { toggleState } = useToggleContext();
  const authService = useAuthContext();
  const { session } = authService;
  const username = session?.user.username || '';
  const plan = session?.user.subscription.label || '';
  const [usernameDraft, setUsernameDraft] = useState(username);
  const [savingUsername, setSavingUsername] = useState(false);
  const [usernameSaved, setUsernameSaved] = useState(false);


  const [upgrading, setUpgrading] = useState(false);

  const usernameDirty = usernameDraft.trim().length > 0 && usernameDraft.trim() !== username;
  const onClose = () => toggleState(false);

  const withinRefundWindow = useMemo(() => {
    if (!proPurchasedAt) return false;
    return daysSince(proPurchasedAt) < REFUND_WINDOW_DAYS;
  }, [proPurchasedAt]);

  const planExpiresAt = useMemo(() => {
    if (!proPurchasedAt) return null;
    return addDays(proPurchasedAt, PLAN_TERM_DAYS);
  }, [proPurchasedAt]);

  async function handleSaveUsername() {
    const next = usernameDraft.trim();
    if (!next || next === username) return;
    setSavingUsername(true);
    setUsernameSaved(false);
    try {
      await onUsernameChange(next);
      setUsernameSaved(true);
    } finally {
      setSavingUsername(false);
    }
  }

  async function handleUpgrade() {
    setUpgrading(true);
    try {
      await onUpgrade();
    } finally {
      setUpgrading(false);
    }
  }



  return (
    <Modal title='Settings' onClose={onClose}>
      <div className='flex flex-col gap-6'>
        <UsernameSection />
        <Divider />
        <PlanSection
          withinRefundWindow={withinRefundWindow}
          planExpiresAt={planExpiresAt}
          onUpgrade={handleUpgrade}
        />
      </div>
    </Modal>
  );
}

function SectionLabel({ children }: React.PropsWithChildren) {
  return <h4 className='text-xs font-semibold uppercase tracking-wide text-slate-400'>{children}</h4>;
}

function Divider() {
  // A quiet nod to the pond: a single ripple line rather than a plain rule.
  return (
    <svg viewBox='0 0 200 8' className='w-full h-2 text-slate-200' preserveAspectRatio='none'>
      <path
        d='M0 4 Q 12.5 0, 25 4 T 50 4 T 75 4 T 100 4 T 125 4 T 150 4 T 175 4 T 200 4'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
      />
    </svg>
  );
}

function UsernameSection() {
  const authService = useAuthContext();
  const [username, setUsername] = useState(() => authService.session?.user.username || '');
  const { action: saveUsername, loading, status } = useAction({
    fn: async () => {
      return await apiService.updateUser({ username })
    },
    onSuccess: () => {
      authService.refreshSession({
        user: {
          username,
        }
      });
    }
  });

  return (
    <section className='flex flex-col gap-2'>
      <SectionLabel>Username</SectionLabel>
      <div className='flex items-center gap-2'>
        <Input
          defaultValue={username}
          maxLength={30}
          placeholder='Choose a username'
          onChange={e => setUsername(e.target.value)}
        />
        <LoaderButton
          loading={loading}
          variant='contained'
          disabled={loading || status === 'success'}
          onClick={saveUsername}
          paddingEnabled shape="rounded">
          Save
        </LoaderButton>
      </div>
      {status === 'success' && (
        <p className='flex items-center gap-1 text-sm text-teal-600'>
          <Check size={14} /> Username updated
        </p>
      )}
    </section>
  );
}

function PlanSection({
  withinRefundWindow,
  planExpiresAt,
  onUpgrade,
}: {
  withinRefundWindow: boolean;
  planExpiresAt: Date | null;
  onUpgrade?: () => void;
}) {
  const [cancelling, setCancelling] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const authService = useAuthContext();
  const plan = authService.session?.user.subscription.label;
  const { action: updateSubscription, status, loading } = useAction({
    fn: async () => {
      return await apiService.updateSubscription(
        plan === 'free' ? 'pro' : 'free'
      );
    },
    onSuccess: () => {
      setConfirmingCancel(false);
    },
    onFinished: () => {
      setCancelling(false);
    }
  })
  const cardClassName = useClassName(
    'flex flex-col gap-3 rounded-md border p-4',
    plan === 'pro' ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50',
  );

  return (
    <section className='flex flex-col gap-3'>
      <SectionLabel>Plan</SectionLabel>

      <div className={cardClassName}>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            {plan === 'pro' ? (
              <span className='flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-600'>
                <Crown size={14} />
              </span>
            ) : (
              <span className='flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-teal-600'>
                <Waves size={14} />
              </span>
            )}
            <div>
              <p className='font-semibold text-black'>{plan === 'pro' ? 'Pond Pro' : 'Free'}</p>
              <p className='text-xs text-slate-500'>
                {plan === 'pro' ? '5€/month · billed annually' : '0€/month'}
              </p>
            </div>
          </div>
        </div>

        <ul className='flex flex-col gap-1 text-sm text-slate-600'>
          <li>{plan === 'pro' ? '5GB of storage' : '150MB of storage'}</li>
          <li>{plan === 'pro' ? 'No ads' : 'Ads'}</li>
        </ul>

        {plan === 'free' && (
          <LoaderButton
            loading={loading}
            variant='contained'
            disabled={status === 'success' || loading}
            onClick={updateSubscription}
            paddingEnabled
            shape="rounded">
            Go Pro — 5€/month
          </LoaderButton>
        )}

        {plan === 'pro' && !confirmingCancel && (
          <Button variant='outlined' onClick={() => setConfirmingCancel(true)} paddingEnabled shape="rounded">
            Cancel subscription
          </Button>
        )}

        {plan === 'pro' && confirmingCancel && (
          <CancelConfirmation
            cancelling={cancelling}
            withinRefundWindow={withinRefundWindow}
            planExpiresAt={planExpiresAt}
            onAbort={() => setConfirmingCancel(false)}
            onConfirm={updateSubscription}
          />
        )}
      </div>
    </section>
  );
}

function CancelConfirmation({
  cancelling,
  withinRefundWindow,
  planExpiresAt,
  onAbort,
  onConfirm,
}: {
  cancelling: boolean;
  withinRefundWindow: boolean;
  planExpiresAt: Date | null;
  onAbort: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className='flex flex-col gap-3 rounded-md border border-amber-200 bg-white p-3'>
      <div className='flex gap-2 text-sm text-slate-700'>
        <TriangleAlert size={16} className='mt-0.5 shrink-0 text-amber-500' />
        {withinRefundWindow ? (
          <p>
            You're still within your 14-day refund window. Canceling now refunds your payment
            and moves you back to Free right away.
          </p>
        ) : (
          <p>
            Your refund window has passed. Canceling keeps Pro active until{' '}
            {planExpiresAt ? formatDate(planExpiresAt) : 'your term ends'}, then you'll move to
            Free. You won't be charged again, and this payment isn't refunded.
          </p>
        )}
      </div>
      <div className='flex justify-end gap-2'>
        <Button variant='ghost' disabled={cancelling} onClick={onAbort}>
          Keep Pro
        </Button>
        <Button variant='outlined' disabled={cancelling} onClick={onConfirm}>
          {cancelling ? <Loader2 className='animate-spin' size={16} /> : 'Confirm cancellation'}
        </Button>
      </div>
    </div>
  );
}
