import React, { startTransition, useState } from "react";
import { Check, Crown, Delete, ExternalLink, Waves } from "lucide-react";
import { Modal } from "../../../components/modal";
import { useClassName } from "../../../hooks/use-class-name";
import { Button, LoaderButton } from "../../../components/button";
import { useToggleContext } from "../../../providers/toggle-provider";
import { useAuthContext } from "../providers/auth-provider";
import { Input } from "../../../components/input";
import { useAction } from "../../../hooks/use-action";
import { useUpgradeSubscription } from "../../billing/hooks/use-upgrade-subscription";
import { useCancelSubscription } from "../../billing/hooks/use-cancel-subscription";
import { ConfirmAction } from "../../../components/confirm-action";
import { api } from "../../../utils/api/api";
import { TUser, TUserPublic, TUserRestricted } from "@pondfm/app-shared";
import { useSubmit } from "../../../hooks/use-submit";
import { Form } from "../../../components/form";
import { Link, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { defaults } from "../../../utils/defaults";
import { TabsProvider } from "../../../providers/tabs-provider";
import { Separator } from "../../../components/separator";

type Plan = "free" | "pro";

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
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function SettingsModal({
  onUsernameChange,
  proPurchasedAt,
  onUpgrade,
  onCancelSubscription,
}: SettingsModalProps) {
  const { toggleState } = useToggleContext();
  const onClose = () => toggleState(false);

  return (
    <Modal title='Settings' onClose={onClose} fullHeight>
      <div className='flex flex-col gap-4 scrollable'>
        <TabsProvider initialTab={"profile"}>
          <div className='flex w-full'>
            <TabsProvider.Button index='profile'>Profile</TabsProvider.Button>
          </div>
          <TabsProvider.Tab index='profile'>
            <DetailsSection />
          </TabsProvider.Tab>
        </TabsProvider>
      </div>
    </Modal>
  );
}

function SectionLabel({ children }: React.PropsWithChildren) {
  return (
    <h4 className='text-xs font-semibold uppercase tracking-wide text-slate-400 ml-1'>
      {children}
    </h4>
  );
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

function DetailsSection() {
  const { session, refreshSession } = useAuthContext();
  const user = session?.user;
  const [details, setDetails] = useState<
    Partial<Pick<TUser, "username" | "bio" | "urls" | "email">>
  >({
    username: user?.username,
    bio: user?.bio,
    urls: user?.urls,
    email: null,
  });
  const [detailsDirty, setDetailsDirty] = useState(false);
  const queryClient = useQueryClient();
  const { submit, status, loading } = useSubmit({
    fetchFn: async (payload) => {
      const data = Object.fromEntries(payload) as typeof details;
      const { url1, url2, url3 } = data as any;
      const urls = [url1, url2, url3].filter((url) => url);
      const res = await api.users.update({
        urls,
      });

      //Refresh the user screen data.
      queryClient.setQueryData(["user", user?.id], (oldData: TUserPublic) => {
        if (!oldData) return oldData;
        return {
          urls,
        };
      });
      await refreshSession({
        user: {
          urls,
        },
      });

      return res;
    },
    onSuccess: async () => {
      setDetailsDirty(false);
    },
  });

  const authService = useAuthContext();
  const navigate = useNavigate();

  const updateDetails = (e: any) => {
    setDetails((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
    setDetailsDirty(true);
  };

  const updateUrls = (url: string) => {
    setDetailsDirty(true);
  };

  return (
    <section className='flex flex-col w-full gap-2'>
      <SectionLabel>Profile</SectionLabel>
      <form className='flex flex-col gap-2 w-full items-end' onSubmit={submit}>
        <div className='w-full'>
          <Link
            to={"https://audius.co/" + session.user.handle}
            className='text-primary flex gap-2 items-center'
            target='_blank'
          >
            <ExternalLink size='1rem' /> <span>Edit profile on Audius</span>
          </Link>
        </div>

        <Form.Group label='Link 1'>
          <Input
            onChange={(e) => updateUrls(e.target.value)}
            defaultValue={session?.user.urls?.at(0)}
            type='url'
            name='url1'
            placeholder='Place a link you want to share here...'
          />
        </Form.Group>
        <Form.Group label='Link 2'>
          <Input
            onChange={(e) => updateUrls(e.target.value)}
            defaultValue={session?.user.urls?.at(1)}
            type='url'
            name='url2'
            placeholder='Place a link you want to share here...'
          />
        </Form.Group>
        <Form.Group label='Link 3'>
          <Input
            onChange={(e) => updateUrls(e.target.value)}
            defaultValue={session?.user.urls?.at(2)}
            type='url'
            name='url3'
            placeholder='Place a link you want to share here...'
          />
        </Form.Group>

        <LoaderButton
          icon={status === "success" && !detailsDirty ? Check : null}
          type='submit'
          variant='text'
          loading={loading}
          disabled={loading || !detailsDirty}
        >
          {status === "success" && !detailsDirty ? "Profile saved!" : "Save Profile"}
        </LoaderButton>
      </form>
      <Separator />
      <div className='flex flex-col gap-2 items-start'>
        <LogoutButton />
        <DeleteAccountButton />
      </div>
    </section>
  );
}

function LogoutButton() {
  const authService = useAuthContext();
  const navigate = useNavigate();
  const {
    action: logout,
    status,
    loading,
  } = useAction({
    fn: async () => {
      return await authService.logout();
    },
    onSuccess: () => {
      navigate("/");
    },
  });
  return (
    <ConfirmAction
      variant='warning'
      onConfirm={logout}
      confirmButton={
        <LoaderButton
          loading={loading}
          disabled={status === "loading" || status === "success"}
          shape='rounded'
          variant='text'
        >
          Logout
        </LoaderButton>
      }
      intentButton={
        <Button variant='text' shape='rounded'>
          Logout
        </Button>
      }
    >
      Are you sure you wish to logout?
    </ConfirmAction>
  );
}

function DeleteAccountButton() {
  const { logout } = useAuthContext();
  const { action, status, loading } = useAction({
    fn: async () => await api.users.delete(),
    onError: (res) => res.error as string,
    onSuccess: async () => {
      await logout();
    },
  });
  return (
    <ConfirmAction
      onConfirm={action}
      variant='danger'
      confirmButton={
        <LoaderButton
          variant='text'
          loading={loading}
          disabled={status === "loading" || status === "success"}
        >
          Delete Account
        </LoaderButton>
      }
      intentButton={
        <Button shape='rounded' variant='text' color='danger'>
          Delete Account
        </Button>
      }
    >
      Deleting an account will also delete all tracks and all likes and reposts on those tracks, as
      well as all likes you have given and all reposts you have created. Are you sure you wish to
      continue? The action cannot be undone.
    </ConfirmAction>
  );
}

function PlanSection() {
  const { toggleState } = useToggleContext();
  const { session } = useAuthContext();

  const daysSinceSubscriptionStart = session
    ? (Date.now() - new Date(session.user.subscription.current_period_start).getTime()) /
      (1000 * 60 * 60 * 24)
    : null;

  const withinRefundWindow = session && daysSinceSubscriptionStart <= 14;
  const planExpiresAt = session ? new Date(session.user.subscription.current_period_end) : null;

  const { cancelSubscription, loading } = useCancelSubscription({
    mode: withinRefundWindow ? "immediate" : "at_period_end",
    onSuccess: () => {
      //Should update the user's session.
      toggleState(false);
    },
  });

  const authService = useAuthContext();
  const plan = authService.session?.user.subscription.plan_id;

  const cardClassName = useClassName(
    "flex flex-col gap-3 rounded-md border p-4 w-full",
    plan === "pro" ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-slate-50",
  );

  const Icon = () => {
    return plan === "pro" ? (
      <span className='flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-600'>
        <Crown size={14} />
      </span>
    ) : (
      <span className='flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-teal-600'>
        <Waves size={14} />
      </span>
    );
  };

  const PlanDetails = () => {
    return (
      <div>
        <p className='font-semibold text-black'>{plan === "pro" ? "Pond Pro" : "Free"}</p>
        <div className='text-xs text-slate-500 flex flex-col'>
          <span>{plan === "pro" ? "5€/month · billed annually" : "0€/month"}</span>
          {plan === "pro" ? (
            <span>
              {planExpiresAt.toLocaleDateString("en")} ·{" "}
              {session?.user.subscription.cancel_at_period_end ? "Plan expires." : "Plan renews."}
            </span>
          ) : null}
        </div>
      </div>
    );
  };

  const PlanFeaturesList = () => {
    return (
      <ul className='flex flex-col gap-1 text-sm text-slate-600'>
        <li>
          {defaults.plans[plan].unique_listener_threshold} unique listeners on the
          undiscovered-feed.
        </li>
        <li>{plan === "pro" ? "No ads." : "Ads."}</li>
      </ul>
    );
  };

  const UpgradePlanButton = () => {
    const { upgradeSubscription, loading, status } = useUpgradeSubscription({
      onSuccess: async (res) => {
        const data = res.data as { checkoutUrl: string };
        window.location.href = data.checkoutUrl;
      },
    });

    return (
      <LoaderButton
        loading={loading}
        variant='ghost'
        disabled={status === "success" || loading}
        onClick={upgradeSubscription}
        shape='rounded'
      >
        Go Pro — 5€/month
      </LoaderButton>
    );
  };

  return (
    <section className='flex flex-col gap-2 items-start'>
      <SectionLabel>Plan</SectionLabel>
      <div className={cardClassName}>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Icon />
            <PlanDetails />
          </div>
        </div>

        <PlanFeaturesList />
      </div>
      <div className='flex w-full flex-col items-start'>
        {plan === "free" && <UpgradePlanButton />}
        {plan === "pro" && !session?.user.subscription.cancel_at_period_end ? (
          <ConfirmAction
            onConfirm={async () => await cancelSubscription()}
            variant='warning'
            intentButton={
              <Button variant='text' shape='rounded'>
                Cancel Subscription
              </Button>
            }
            intentCancelButton={<Button variant='text'>Keep Pro</Button>}
            confirmButton={
              <LoaderButton
                variant='text'
                loading={loading}
                disabled={loading || status === "success"}
              >
                Cancel Pro
              </LoaderButton>
            }
          >
            <p>
              {withinRefundWindow
                ? "You're still within your 14-day refund window. Canceling now refunds your payment and moves you back to Free right away."
                : ` Your refund window has passed. Canceling keeps Pro active until
            ${planExpiresAt ? formatDate(planExpiresAt) : "your term ends"}, then you'll move to
            Free. You won't be charged again, and this payment isn't refunded.`}{" "}
              <span className='text-amber-700'>
                Canceling a Pro plan will cause your oldest tracks contributing to the Free plan
                storage quota overage to be deleted.
              </span>
            </p>
          </ConfirmAction>
        ) : null}
      </div>
    </section>
  );
}

function LogoutSection() {
  const authService = useAuthContext();
  const navigate = useNavigate();

  const {
    action: logout,
    status,
    loading,
  } = useAction({
    fn: async () => {
      return await authService.logout();
    },
    onSuccess: () => {
      navigate("/");
    },
  });
  return (
    <section className='flex flex-col gap-2 w-full'>
      <SectionLabel>Other</SectionLabel>
      <div className='flex w-full justify-end'>
        <LoaderButton
          variant='text'
          onClick={logout}
          loading={loading}
          disabled={loading || status === "success"}
        >
          Logout
        </LoaderButton>
      </div>
    </section>
  );
}
