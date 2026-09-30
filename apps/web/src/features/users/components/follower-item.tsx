import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { defaults } from "../../../utils/defaults";
import { useUserContext } from "../providers/user-proivder";
import { useToggleContext } from "../../../providers/toggle-provider";
import { TUserPublic } from "@pondfm/app-shared";

type FollowerItemProps = {
  user: TUserPublic;
};

/**Renders the component used to show a user on the follower- or following feeds. */
export function FollowerItem({ user }: FollowerItemProps) {
  const { toggleState: toggleModal } = useToggleContext();
  const navigate = useNavigate();
  const onClick = () => {
    toggleModal(false);
    navigate(defaults.url.userTracks(user.audius_user_id));
  };

  return (
    <div
      onClick={onClick}
      className='text-sm text-primary font-semibold py-2 cursor-pointer flex gap-2 items-center'
    >
      <div className='flex items-center justify-center bg-primary rounded-full text-white w-8 h-8'>
        <User size='1rem' />
      </div>

      {user.username}
    </div>
  );
}
