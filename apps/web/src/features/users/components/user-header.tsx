import { useState } from "react";
import { Button } from "../../../components/button";
import { cancelable } from "../../../utils/debounced";
import { useQueryClient } from "@tanstack/react-query";
import { useUserContext } from "../../users/providers/user-proivder";
import { Music, User, UserMinus, UserPlus } from "lucide-react";
import { ToggleProvider } from "../../../providers/toggle-provider";
import { FollowingFeedModal } from "./following-feed-modal";
import { FollowerFeedModal } from "./follower-feed-modal";
import { FaBrandIconLink } from "../../../components/fa-brand-icon-link";
import { useNavigate } from "react-router-dom";
import { defaults } from "../../../utils/defaults";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { useAuthenticatedAction } from "../../posts/hooks/use-return-to-url";
import { usePlayData } from "../../charting/hooks/use-play-data-";
import { PlaysPerDayChart, PlaysPerMonthChart } from "../../charting/components/play-count-chart";
import { usePlayCount } from "../../audio/hooks/use-play-count";

/**Renders the header at the top of a user's profile screen. */
export function UserHeader() {
  const { status, session } = useAuthContext();
  const { user } = useUserContext();
  const [followedByMe, setFollowedByMe] = useState(user.followed_by_me);
  const { data: playsPerDay, isLoading } = usePlayData("week");

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

  const FollowButtonIcon = followedByMe ? UserMinus : UserPlus;
  const urls = user.urls;
  return (
    <div className='flex flex-col w-full py-2 h-pad gap-4 items-start'>
      {/**Header portion */}
      <div className='w-full leading-none flex flex-row justify-between xs:items-start'>
        <div className='flex sm:gap-8 xs:gap-2 md:items-center xs:items-start'>
          <div
            className='flex gap-2 items-center cursor-pointer'
            onClick={() => navigate(defaults.url.userTracks(user.id))}
          >
            <div className='flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white'>
              <User size='1rem' />
            </div>
            <h2 className='text-sm font-semibold text-primary'>{user.username}</h2>
          </div>
        </div>
        <Button
          color={followedByMe ? "danger" : "primary"}
          variant='text'
          onClick={onFollowButtonClicked}
          icon={FollowButtonIcon}
        >
          <span className='text-sm'>{followedByMe ? "Unfollow" : "Follow"}</span>
        </Button>
      </div>
      <div className='flex xs:flex-col md:flex-row w-full lg:justify-between gap-2'>
        <div className='flex flex-col flex-1 gap-4'>
          <p className='text-sm text-slate-500 xs:w-full md:w-92'>{user.bio || "No bio."}</p>
          {urls ? (
            <div className='flex flex-col gap-2'>
              {urls.map((url, i) => {
                return (
                  <FaBrandIconLink
                    key={i}
                    to={url}
                    className='text-sm text-primary'
                    target='_blank'
                  />
                );
              })}
            </div>
          ) : null}
          {/**Bottom controls */}
          <div className='flex w-full items-center justify-between'>
            <div className='flex items-center sm:gap-4 xs:gap-2'>
              <ToggleProvider>
                <ToggleProvider.Trigger>
                  <Button variant='text'>
                    <span className='text-xs font-semibold text-primary'>
                      {user.follower_count} Followers
                    </span>
                  </Button>
                </ToggleProvider.Trigger>
                <ToggleProvider.Target>
                  <FollowerFeedModal />
                </ToggleProvider.Target>
              </ToggleProvider>
              <ToggleProvider>
                <ToggleProvider.Trigger>
                  <Button variant='text'>
                    <span className='text-xs font-semibold text-primary'>
                      {" "}
                      {user.following_count} Following
                    </span>
                  </Button>
                </ToggleProvider.Trigger>
                <ToggleProvider.Target>
                  <FollowingFeedModal />
                </ToggleProvider.Target>
              </ToggleProvider>
            </div>
          </div>
        </div>
        {status === "authenticated" && session?.user.id === user.id ? <ChartSelector /> : null}
      </div>
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
    <div className='flex flex-col gap-2 xs:h-[200px] lg:h-auto sm:w-full lg:w-[450px]'>
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
