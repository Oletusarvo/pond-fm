import { PostAuthor } from './post-author';
import { Title } from './title';
import { StatsArea } from './stats-area';
import { PlayerArea } from './play-area';
import { TagList } from './tag-list';
import { TipButton } from './tip-button';
import { UploadTime } from './upload-time';
import { usePostContext } from '../providers/post-provider';

export function Post() {
  const { post } = usePostContext();
  return (
    <div className='flex py-2 rounded-md bg-white w-full flex-col gap-2 items-start h-pad'>
      <div className='flex justify-between w-full items-start'>
        <div className='flex flex-col'>
          <PostAuthor />
          <Title />
        </div>
        <UploadTime />
      </div>
      <PlayerArea />
      <StatsArea />
      <TagList tags={post.track.tags} />
    </div>
  );
}
