import { Repeat } from 'lucide-react';
import { usePostContext } from '../providers/post-provider';
import { CountButton } from './count-button';
import { useRepostContext } from '../providers/repost-provider';
import { useAuthContext } from '../../auth/providers/auth-provider';
import { useActionContext } from '../../../providers/action-provider';
import React from 'react';
import { Button } from '../../../components/button';

/**Renders repost-buttons using the CountButton-component. Must be placed within a PostProvider.
 * Depends on the AuthProvider, and will be disabled if the current authenticated user is the
 * author of the post.
 */
export function RepostButton() {
  const { post, toggleRepost } = usePostContext();
  const { status } = useAuthContext();
  const color = 'var(--color-blue-500)';

  return (
    <CountButton
      color={'inherit'}
      disabled={status !== 'authenticated' || post?.reposted_by_me}
      icon={props => (
        <Repeat
          {...props}
          color={post?.reposted_by_me ? color : 'var(--color-slate-500)'}
        />
      )}
      value={post?.repost_count}
      onClick={() => toggleRepost(true)}
    />
  );
}
