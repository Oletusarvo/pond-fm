import { Heart } from 'lucide-react';
import { usePostContext } from '../providers/post-provider';
import { CountButton } from './count-button';
import { useAuthContext } from '../../auth/providers/auth-provider';
import { useActionContext } from '../../../providers/action-provider';
import { usePostActions } from '../hooks/use-post-actions';
import { Button } from '../../../components/button';

export function LikeButton() {
  const { post } = usePostContext();
  const postActions = usePostActions({ trackId: post.track.id });
  const { status } = useAuthContext();
  const color = 'var(--color-red-500)';
  return (
    <CountButton
      color={'inherit'}
      disabled={status !== 'authenticated'}
      icon={props => (
        <Heart
          {...props}
          color={post?.liked_by_me ? 'transparent' : color}
          fill={post?.liked_by_me ? color : 'transparent'}
        />
      )}
      value={post?.like_count}
      onClick={() => postActions.toggleLike()}
    />
  );
}
