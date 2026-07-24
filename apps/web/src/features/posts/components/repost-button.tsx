import { Repeat } from 'lucide-react';
import { usePostContext } from '../providers/post-provider';
import { Count } from './count';
import { useRepostContext } from '../providers/repost-provider';

export function RepostButton() {
  const { post, repostedByMe } = usePostContext();
  const { showRepostModal } = useRepostContext();
  const color = 'var(--color-blue-500)';
  return (
    <Count
      icon={props => (
        <Repeat
          {...props}
          color={repostedByMe ? color : 'var(--color-slate-500)'}
        />
      )}
      value={post.repost_count}
      onClick={showRepostModal}
    />
  );
}
