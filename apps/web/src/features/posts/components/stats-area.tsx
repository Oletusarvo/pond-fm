import { Play, Settings } from 'lucide-react';
import { usePostContext } from '../providers/post-provider';
import { Count } from './count';
import { LikeButton } from './like-button';
import { RepostButton } from './repost-button';
import { TipButton } from './tip-button';
import { useAuthContext } from '../../auth/providers/auth-provider';
import { Button } from '../../../components/button';

export function StatsArea() {
  const { post } = usePostContext();
  const authService = useAuthContext();
  return (
    <div className='flex gap-5 items-center'>
      <Count
        icon={Play}
        value={post?.play_count}
      />

      <LikeButton />
      {post?.track.author.id !== authService.session?.user.id ? <RepostButton /> : null}


    </div>
  );
}


