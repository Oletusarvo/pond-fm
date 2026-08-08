import { useState } from "react";
import { Button } from "../../../components/button";
import { cancelable } from "../../../utils/debounced";
import { useQueryClient } from "@tanstack/react-query";
import { useUserContext } from "../../users/providers/user-proivder";
import { Music } from "lucide-react";


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

  return (
    <div className='py-2 w-full h-pad leading-none flex flex-row justify-between xs:items-start'>
      <div className="flex md:gap-8 xs:gap-1 md:items-center xs:items-start xs:flex-col md:flex-row">
        <div className="flex gap-2 items-center">
          <Music size="1.2rem" color="var(--color-primary)" />
          <h2 className='text-sm font-semibold text-primary'>{user.username}</h2>
        </div>
        <div className="flex items-center gap-4">
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

      <Button variant="ghost" onClick={onFollowButtonClicked}><span className="text-sm text-primary">
        {followedByMe ? 'Unfollow' : 'Follow'}</span></Button>
    </div>
  );
}