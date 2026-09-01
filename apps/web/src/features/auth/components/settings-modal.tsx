import React, { useState } from 'react';
import { Check, Crown, Waves } from 'lucide-react';
import { Modal } from '../../../components/modal';
import { useClassName } from '../../../hooks/use-class-name';
import { Button, LoaderButton } from '../../../components/button';
import { useToggleContext } from '../../../providers/toggle-provider';
import { useAuthContext } from '../providers/auth-provider';
import { Input } from '../../../components/input';
import { useAction } from '../../../hooks/use-action';
import { apiService } from '../../../utils/api/api-service';
import { useUpgradeSubscription } from '../../billing/hooks/use-upgrade-subscription';
import { useCancelSubscription } from '../../billing/hooks/use-cancel-subscription';
import { ConfirmAction } from '../../../components/confirm-action';

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
  const [usernameDraft, setUsernameDraft] = useState(username);
  const usernameDirty = usernameDraft.trim().length > 0 && usernameDraft.trim() !== username;
  const onClose = () => toggleState(false);

  return (
    <Modal title='Settings' onClose={onClose}>
      <div className='flex flex-col gap-6'>
        <UsernameSection />
        <Divider />
        <PlanSection

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

function PlanSection() {
  const { toggleState } = useToggleContext();
  const { session } = useAuthContext();

  const daysSinceSubscriptionStart = session ? ((Date.now() - new Date(session.user.subscription.current_period_start).getTime()) / (1000 * 60 * 60 * 24)) : null;
  const withinRefundWindow = session && daysSinceSubscriptionStart <= 14;
  const planExpiresAt = session ? new Date(session.user.subscription.current_period_end) : null;

  const { cancelSubscription, loading } = useCancelSubscription({
    onSuccess: () => {
      //Should update the user's session.
      toggleState(false);
    }
  });

  const authService = useAuthContext();
  const plan = authService.session?.user.subscription.plan_id;

  const cardClassName = useClassName(
    'flex flex-col gap-3 rounded-md border p-4',
    plan === 'pro' ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50',
  );

  const Icon = () => {
    return plan === 'pro' ? (
      <span className='flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-600'>
        <Crown size={14} />
      </span>
    ) : (
      <span className='flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-teal-600'>
        <Waves size={14} />
      </span>
    )
  }

  const PlanDetails = () => {
    return (
      <div>
        <p className='font-semibold text-black'>{plan === 'pro' ? 'Pond Pro' : 'Free'}</p>
        <p className='text-xs text-slate-500'>
          {plan === 'pro' ? '5€/month · billed annually' : '0€/month'}
        </p>
      </div>
    )
  }

  const PlanFeaturesList = () => {
    return (
      <ul className='flex flex-col gap-1 text-sm text-slate-600'>
        <li>{plan === 'pro' ? '100 unique listeners on the discovery feed' : '25 unique listeners on the discovery feed.'}</li>
        <li>{plan === 'pro' ? '5GB of storage' : '150MB of storage'}</li>
        <li>{plan === 'pro' ? 'No ads' : 'Ads'}</li>
      </ul>
    );
  }

  const UpgradePlanButton = () => {
    const { upgradeSubscription, loading, status } = useUpgradeSubscription({
      onSuccess: async (res) => {
        const data = await res.json();
        window.location.href = data.checkoutUrl;
      }
    });

    return (
      <LoaderButton
        loading={loading}
        variant='contained'
        disabled={status === 'success' || loading}
        onClick={upgradeSubscription}
        paddingEnabled
        shape="rounded">
        Go Pro — 5€/month
      </LoaderButton>
    );
  }

  return (
    <section className='flex flex-col gap-3'>
      <SectionLabel>Plan</SectionLabel>
      <div className={cardClassName}>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Icon />
            <PlanDetails />
          </div>
        </div>

        <PlanFeaturesList />

        {plan === 'free' && (
          <UpgradePlanButton />
        )}

        {
          plan === 'pro' && (
            <ConfirmAction
              onConfirm={async () => await cancelSubscription()}
              variant="warning.outlined"
              intentButton={<Button fullWidth variant='outlined' paddingEnabled shape="rounded">Cancel Subscription</Button>}
              intentCancelButton={<Button variant="text">Keep Pro</Button>}
              confirmButton={<LoaderButton variant="text" loading={loading} disabled={loading || status === 'success'}>Cancel Pro</LoaderButton>}>
              <p>
                {
                  withinRefundWindow
                    ?
                    "You're still within your 14-day refund window. Canceling now refunds your payment and moves you back to Free right away."
                    :
                    ` Your refund window has passed. Canceling keeps Pro active until
            ${planExpiresAt ? formatDate(planExpiresAt) : 'your term ends'}, then you'll move to
            Free. You won't be charged again, and this payment isn't refunded.`
                }
              </p>

            </ConfirmAction>
          )
        }
      </div>
    </section>
  );
}
