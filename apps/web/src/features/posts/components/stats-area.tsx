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

  return (
    <div className='flex gap-5 items-center'>
      <Count
        icon={Play}
        value={post.play_count}
      />

      <LikeButton />
      <RepostButton />
      <SettingsButton />
    </div>
  );
}

function SettingsButton() {
  const authService = useAuthContext();
  const postService = usePostContext();
  return authService.session?.user.id === postService.post.track.author.id ? <Button onClick={() => postService.toggleEdit(true)} type="button" variant='ghost' shape='circle'><Settings size="1rem" /></Button> : null
}
