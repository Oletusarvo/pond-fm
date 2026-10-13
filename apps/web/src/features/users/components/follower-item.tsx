import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { defaults } from "../../../utils/defaults";
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
    navigate(defaults.url.userTracks(user.id));
  };

  return (
    <button
      type='button'
      onClick={onClick}
      className='flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left transition-all duration-150 hover:border-emerald-200 hover:bg-emerald-50/60'
    >
      <div className='flex min-w-0 items-center gap-3'>
        <div className='flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-emerald-200 bg-emerald-500/10 text-emerald-700 shadow-sm'>
          {user.profile_picture ? (
            <img
              src={user.profile_picture}
              alt={user.username}
              className='h-full w-full object-cover'
            />
          ) : (
            <User size='1rem' />
          )}
        </div>

        <div className='min-w-0'>
          <div className='truncate text-sm font-bold text-slate-900'>{user.username}</div>
          <div className='text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500'>
            Artist profile
          </div>
        </div>
      </div>

      <div className='rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600'>
        View
      </div>
    </button>
  );
}
