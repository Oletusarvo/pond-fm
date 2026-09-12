import { useState } from "react";
import { Button } from "../../../components/button";
import { cancelable } from "../../../utils/debounced";
import { useQueryClient } from "@tanstack/react-query";
import { useUserContext } from "../../users/providers/user-proivder";
import { Music, User, UserMinus, UserPlus } from "lucide-react";
import { ToggleProvider } from "../../../providers/toggle-provider";
import { FollowingFeedModal } from "./following-feed-modal";
import { FollowerFeedModal } from "./follower-feed-modal";

/**Renders the header at the top of a user's profile screen. */
export function UserHeader() {
  const { user, ...userService } = useUserContext();
  const [followedByMe, setFollowedByMe] = useState(user.followed_by_me);

  const queryClient = useQueryClient();
  const onFollowButtonClicked = async () => {
    const initialFollowed = followedByMe;
    const newFollowed = !initialFollowed;

    setFollowedByMe(newFollowed);
    await cancelable
      .toggleFollow(user.id, initialFollowed)
      .then(async (result) => {
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

  return (
    <div className='flex flex-col w-full py-2 h-pad gap-1'>
      <div className='w-full leading-none flex flex-row justify-between xs:items-start'>
        <div className='flex sm:gap-8 xs:gap-2 md:items-center xs:items-start'>
          <div className='flex gap-2 items-center'>
            <div className='flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white'>
              <User size='1rem' />
            </div>
            <h2 className='text-xs font-semibold text-primary'>
              {user.username}
            </h2>
          </div>
        </div>
        <Button
          color={followedByMe ? "danger" : "primary"}
          variant='ghost'
          onClick={onFollowButtonClicked}
          icon={FollowButtonIcon}
        >
          <span className='text-xs'>
            {followedByMe ? "Unfollow" : "Follow"}
          </span>
        </Button>
      </div>
      <p className='text-sm text-slate-500 xs:w-full md:w-92'>
        {user.bio || "No bio."}
      </p>
      {/**Bottom controls */}
      <div className='flex w-full items-center justify-between'>
        <div className='flex items-center sm:gap-4 xs:gap-2'>
          <ToggleProvider>
            <ToggleProvider.Trigger>
              <Button variant='ghost'>
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
              <Button variant='ghost'>
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
  );
}
