import { PostAuthor } from "./post-author";
import { Title } from "./title";
import { StatsArea } from "./stats-area";
import { AudioPlayer } from "../../audio/components/audio-player";
import { TagList } from "./tag-list";
import { UploadTime } from "./upload-time";
import { useTrackContext } from "../providers/post-provider";
import { Tag } from "./tag";
import { SettingsButton } from "./track-settings-button";
import { ToggleProvider } from "../../../providers/toggle-provider";
import { UpdateTrackModal } from "./update-track-modal";
import { Button } from "../../../components/button";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { ReportModal } from "./report-modal";
import { usePlaybackContext } from "../../audio/providers/playback-provider";
import { useClassName } from "../../../hooks/use-class-name";
import { Spinner } from "../../../components/spinner";
import { trackToPlayback } from "../../../utils/post-to-playback";

/**The main component responsible for rendering posts. Includes an AudioPlayer, stats and other information.
 * Must be a child of a PostProvider.
 */
export function Post({ ref }: { ref?: React.RefObject<any> }) {
  const { track: post } = useTrackContext();
  const { currentPlayback, togglePlayback, updateCurrentPlayback } = usePlaybackContext();
  const isPlaying = currentPlayback?.track.id === post?.id;
  const containerClassName = useClassName(
    "flex py-2 rounded-md w-full flex-col gap-1 items-start transition-colors duration-500",
    isPlaying ? "bg-primary/5" : "bg-white",
  );

  const trackId = post?.id;
  const playbackTrackId = currentPlayback?.track.id;
  const onClick = () => {
    if (playbackTrackId !== trackId) {
      updateCurrentPlayback(trackToPlayback(post));
    }
  };
  return (
    <div ref={ref} className={containerClassName} onClick={onClick}>
      <Content />
    </div>
  );
}

function Content() {
  const { session } = useAuthContext();
  const { track: post } = useTrackContext();
  return (
    <>
      <div className='flex justify-between w-full items-start'>
        <div className='flex flex-col leading-none items-start'>
          <PostAuthor />
          <div className='flex items-center gap-2'>
            <Title />
            <ToggleProvider>
              <ToggleProvider.Trigger>
                <SettingsButton />
              </ToggleProvider.Trigger>
              <ToggleProvider.Target>
                <UpdateTrackModal track={post.track} />
              </ToggleProvider.Target>
            </ToggleProvider>
          </div>
          {session?.user.id !== post.author.id ? (
            <ToggleProvider>
              <ToggleProvider.Trigger>
                <Button variant='text' color='danger'>
                  <span className='text-xs text-red-700'>Report</span>
                </Button>
              </ToggleProvider.Trigger>
              <ToggleProvider.Target>
                <ReportModal />
              </ToggleProvider.Target>
            </ToggleProvider>
          ) : null}
        </div>
        <div className='flex flex-col items-end gap-1'>
          <UploadTime />
          <Tag value={post?.genre} size='small' selected={true} />
        </div>
      </div>
      <div className='flex gap-2 w-full items-center'>
        <img src={post?.artwork} className='w-24 h-24 rounded-lg' />
        <AudioPlayer />
      </div>

      <div className='flex justify-between w-full'>
        <StatsArea />
        <TagList tags={post?.moods} size={"small"} color='secondary' />
      </div>
    </>
  );
}
