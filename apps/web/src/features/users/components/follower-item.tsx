/**Renders the component used to show a user on the follower- or following feeds. */
export function FollowerItem({ user, onClick }) {
  return (
    <div
      onClick={onClick}
      className='text-sm text-primary font-semibold py-2 cursor-pointer'
    >
      {user.username}
    </div>
  );
}
