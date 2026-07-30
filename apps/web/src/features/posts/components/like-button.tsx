import { Heart } from 'lucide-react';
import { usePostContext } from '../providers/post-provider';
import { Count } from './count';
import { useAuthContext } from '../../auth/providers/auth-provider';

export function LikeButton() {
  const { post, toggleLike } = usePostContext();
  const { status } = useAuthContext();
  const color = 'var(--color-red-500)';
  return (
    <Count
      disabled={status !== 'authenticated'}
      icon={props => (
        <Heart
          {...props}
          color={post.liked_by_me ? 'transparent' : color}
          fill={post.liked_by_me ? color : 'transparent'}
        />
      )}
      value={post.like_count}
      onClick={toggleLike}
    />
  );
}
