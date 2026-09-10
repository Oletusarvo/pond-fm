import { User } from "lucide-react";

/**Renders the component used to show a user on the follower- or following feeds. */
export function FollowerItem({ user, onClick }) {
  return (
    <div
      onClick={onClick}
      className='text-sm text-primary font-semibold py-2 cursor-pointer flex gap-1 items-center'
    >
      <User size='1rem' />
      {user.username}
    </div>
  );
}
