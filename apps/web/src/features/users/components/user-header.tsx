import { useState } from "react";
import { Button } from "../../../components/button";
import { cancelable } from "../../../utils/debounced";
import { useQueryClient } from "@tanstack/react-query";
import { useUserContext } from "../../users/providers/user-proivder";
import { Music, User, UserMinus, UserPlus } from "lucide-react";

/**@todo This should be moved under features/users/components */
export function UserHeader() {
  const { user, ...userService } = useUserContext();
  const [followedByMe, setFollowedByMe] = useState(user.followed_by_me);

  const queryClient = useQueryClient();
  const onFollowButtonClicked = async () => {
    const initialFollowed = followedByMe;
    const newFollowed = !initialFollowed;

    setFollowedByMe(newFollowed);
    await cancelable.toggleFollow(user.id, initialFollowed)
      .then(async result => {
        if (result.executed) {
          if (!result.value.ok) {
            setFollowedByMe(initialFollowed)
          }
          else {
            await queryClient.invalidateQueries({
              queryKey: ['user', user.id]
            });

            await queryClient.invalidateQueries({
              queryKey: ['followers', user.id]
            })
          }
        }

      });
  }

  const FollowButtonIcon = followedByMe ? UserMinus : UserPlus;

  return (
    <div className='py-2 w-full h-pad leading-none flex flex-row justify-between xs:items-start'>
      <div className="flex sm:gap-8 xs:gap-2 md:items-center xs:items-start">
        <div className="flex gap-2 items-center">
          <User size="1.2rem" color="var(--color-primary)" />
          <h2 className='text-sm font-semibold text-primary'>{user.username}</h2>
        </div>
        <Button
          color={followedByMe ? 'danger' : 'primary'}
          variant="ghost"
          onClick={onFollowButtonClicked} icon={FollowButtonIcon}><span className="text-sm">
            {followedByMe ? 'Unfollow' : 'Follow'}</span></Button>

      </div>

      <div className="flex items-center sm:gap-4 xs:gap-2">
        <Button
          variant="ghost"
          onClick={() => userService.toggleShowFollowingModal(true)}>
          <span className="text-sm font-semibold text-primary"> {user.following_count} Following</span>
        </Button>
        <Button variant="ghost" onClick={() => userService.toggleShowFollowerModal(true)}>
          <span className="text-sm font-semibold text-primary">{user.follower_count} Followers</span>
        </Button>
      </div>
    </div>
  );
}