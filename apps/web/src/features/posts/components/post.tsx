import { PostAuthor } from './post-author';
import { Title } from './title';
import { StatsArea } from './stats-area';
import { AudioPlayer } from '../../audio/components/audio-player';
import { TagList } from './tag-list';
import { TipButton } from './tip-button';
import { UploadTime } from './upload-time';
import { usePostContext } from '../providers/post-provider';
import { Tag } from './tag';
import { SettingsButton } from './track-settings-button';

/**The main component responsible for rendering posts. Includes an AudioPlayer, stats and other information.
 * Must be a child of a PostProvider.
 */
export function Post() {
  const { post } = usePostContext();
  return (
    <div className='flex py-2 rounded-md bg-white w-full flex-col gap-2 items-start h-pad'>
      <div className='flex justify-between w-full items-start'>
        <div className='flex flex-col leading-none'>
          <PostAuthor />
          <div className="flex items-center gap-2">
            <Title />
            <SettingsButton />
          </div>

        </div>
        <div className='flex flex-col items-end gap-1'>
          <UploadTime />
          <Tag value={post?.track.genre} size="small" selected={true} />
        </div>

      </div>
      <AudioPlayer />
      <div className='flex justify-between w-full'>
        <StatsArea />
        <TagList tags={post?.track.moods} size={'small'} color='secondary' />
      </div>
    </div>
  );
}
