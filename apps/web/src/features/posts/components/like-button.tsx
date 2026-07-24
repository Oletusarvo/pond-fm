import { Heart } from 'lucide-react';
import { usePostContext } from '../providers/post-provider';
import { Count } from './count';

export function LikeButton() {
  const { post, toggleLike } = usePostContext();
  const color = 'var(--color-red-500)';
  return (
    <Count
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
