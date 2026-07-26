import { Play } from 'lucide-react';
import { usePostContext } from '../providers/post-provider';
import { Count } from './count';
import { LikeButton } from './like-button';
import { RepostButton } from './repost-button';
import { TipButton } from './tip-button';
import { useAuthContext } from '../../auth/providers/auth-provider';

export function StatsArea() {
  const { post } = usePostContext();
  const { status } = useAuthContext();
  return (
    <div className='flex gap-8 items-center'>
      <Count
        icon={Play}
        value={post.play_count}
      />

      <LikeButton />
      <RepostButton />

      <TipButton />
    </div>
  );
}
