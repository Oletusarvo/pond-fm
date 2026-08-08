import { Repeat } from 'lucide-react';
import { usePostContext } from '../providers/post-provider';
import { Count } from './count';
import { useRepostContext } from '../providers/repost-provider';
import { useAuthContext } from '../../auth/providers/auth-provider';
import { useActionContext } from '../../../providers/action-provider';

export function RepostButton() {
  const { post, toggleRepost } = usePostContext();
  const { status } = useAuthContext();
  const color = 'var(--color-blue-500)';

  return (
    <Count
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
