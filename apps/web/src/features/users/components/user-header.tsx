import { useState } from "react";
import { cancelable } from "../../../utils/debounced";
import { useQueryClient } from "@tanstack/react-query";
import { useUserContext } from "../../users/providers/user-proivder";
import { User, UserMinus, UserPlus } from "lucide-react";
import { ToggleProvider } from "../../../providers/toggle-provider";
import { FollowingFeedModal } from "./following-feed-modal";
import { FollowerFeedModal } from "./follower-feed-modal";
import { FaBrandIconLink } from "../../../components/fa-brand-icon-link";
import { useNavigate } from "react-router-dom";
import { defaults } from "../../../utils/defaults";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { usePlayData } from "../../charting/hooks/use-play-data-";
import { PlaysPerDayChart, PlaysPerMonthChart } from "../../charting/components/play-count-chart";

/**Renders the header at the top of a user's profile screen. */
export function UserHeader() {
  const { status } = useAuthContext();
  const { user } = useUserContext();
  const [followedByMe, setFollowedByMe] = useState(user.followed_by_me);
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const onFollowButtonClicked = async () => {
    if (status === "unauthenticated") {
      return navigate(`/login?return=/user/${user.id}&callback=/user/${user.id}`);
    }
    const initialFollowed = followedByMe;
    const newFollowed = !initialFollowed;

    setFollowedByMe(newFollowed);

    await cancelable.toggleFollow(user.id, initialFollowed).then(async (result) => {
      if (result.executed) {
        if (!result.value.success) {
          setFollowedByMe(initialFollowed);
        } else {
          await queryClient.invalidateQueries({
            queryKey: ["user", user.id],
          });

          await queryClient.invalidateQueries({
            queryKey: ["followers", user.id],
          });
        }
      }
    });
  };

  const urls = user.urls;

  return (
    <section className='relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_38%),linear-gradient(180deg,#ffffff,#f8fafc)] p-4 shadow-[0_20px_60px_rgba(15,23,42,0.06)] md:p-6'>
      <div className='flex flex-col gap-5'>
        <div className='flex items-start justify-between gap-4'>
          <div
            className='flex min-w-0 items-center gap-3 md:gap-4'
            onClick={() => navigate(defaults.url.userTracks(user.id))}
          >
            <div className='flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-emerald-200 bg-emerald-500/10 text-emerald-700 shadow-sm md:h-20 md:w-20'>
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  loading='lazy'
                  className='h-full w-full object-cover'
                />
              ) : (
                <User size='1.1rem' />
              )}
            </div>

            <div className='min-w-0'>
              <h2 className='truncate text-lg font-black tracking-tight text-slate-900 md:text-2xl'>
                {user.username}
              </h2>
              <p className='mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500'>
                Artist profile
              </p>
            </div>
          </div>

          <button
            type='button'
            onClick={onFollowButtonClicked}
            className={[
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-150",
              followedByMe
                ? "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900"
                : "border-emerald-500 bg-emerald-500 text-white shadow-sm shadow-emerald-500/20 hover:bg-emerald-400",
            ].join(" ")}
          >
            {followedByMe ? <UserMinus size='1rem' /> : <UserPlus size='1rem' />}
            {followedByMe ? "Unfollow" : "Follow"}
          </button>
        </div>

        <div className='flex flex-col gap-4'>
          <p className='max-w-2xl text-sm leading-7 text-slate-600 md:text-base'>
            {user.bio || "No bio."}
          </p>

          {urls && urls.length ? (
            <div className='flex flex-wrap items-center gap-2'>
              {urls.map((url, i) => (
                <FaBrandIconLink
                  key={i}
                  to={url}
                  className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:border-emerald-200 hover:text-emerald-800'
                  target='_blank'
                />
              ))}
            </div>
          ) : null}

          <div className='flex flex-wrap items-center gap-3'>
            <ToggleProvider>
              <ToggleProvider.Trigger>
                <button
                  type='button'
                  className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900'
                >
                  {user.follower_count} Followers
                </button>
              </ToggleProvider.Trigger>
              <ToggleProvider.Target>
                <FollowerFeedModal />
              </ToggleProvider.Target>
            </ToggleProvider>

            <ToggleProvider>
              <ToggleProvider.Trigger>
                <button
                  type='button'
                  className='rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-900'
                >
                  {user.following_count} Following
                </button>
              </ToggleProvider.Trigger>
              <ToggleProvider.Target>
                <FollowingFeedModal />
              </ToggleProvider.Target>
            </ToggleProvider>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const { user } = useUserContext();

  return (
    <div className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
      <StatBlock label='Followers' value={user.follower_count} />
      <StatBlock label='Following' value={user.following_count} />
      <StatBlock label='Tracks' value={user.track_count ?? 0} />
      <StatBlock label='Status' value={user.followed_by_me ? "Following" : "Public"} />
    </div>
  );
}

function StatLabel({ children }) {
  return (
    <div className='text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500'>
      {children}
    </div>
  );
}

function StatBlock({ label, value }: { label: string; value: string | number }) {
  return (
    <div className='rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm'>
      <StatLabel>{label}</StatLabel>
      <div className='mt-2 text-lg font-black text-slate-900'>{value}</div>
    </div>
  );
}

function ChartSelector() {
  const [interval, setInterval] = useState<"week" | "month" | "year">("week");
  const { data: playData, isLoading } = usePlayData(interval);
  const title =
    interval === "week"
      ? "Plays last 7 days"
      : interval === "month"
        ? "Plays last 30 days"
        : "Plays last 12 months";
  return (
    <div className='flex flex-col gap-2 xs:h-[200px] lg:h-[200px] sm:w-full lg:w-[450px]'>
      <div className='flex justify-between'>
        <h2 className='font-semibold text-sm'>{title}</h2>
        <select onChange={(e) => setInterval(e.target.value as typeof interval)}>
          <option value='week'>Last 7 days</option>
          <option value='month'>Last 30 days</option>
        </select>
      </div>
      {interval === "week" || interval === "month" ? (
        <PlaysPerDayChart data={(playData as any[]) || []} />
      ) : (
        <PlaysPerMonthChart data={(playData as any[]) || []} />
      )}
    </div>
  );
}
