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
import { AudioLines, Columns, TriangleAlert } from "lucide-react";

/**The main component responsible for rendering posts. Includes an AudioPlayer, stats and other information.
 * Must be a child of a PostProvider.
 */
export function Post({ ref }: { ref?: React.RefObject<any> }) {
  const { track: post } = useTrackContext();
  const { currentPlayback, togglePlayback, updateCurrentPlayback } = usePlaybackContext();
  const isPlaying = currentPlayback?.track.id === post?.id;
  const containerClassName = useClassName(
    "flex py-2 rounded-md w-full flex-col gap-1 items-start transition-colors duration-500 grow-0",
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
  const { currentPlayback } = usePlaybackContext();
  return (
    <>
      <div className='flex gap-1 flex-1 w-full overflow-hidden'>
        <img src={post?.artwork} className='xs:w-24 xs:h-24 lg:w-32 lg:h-32 rounded-lg' />
        <div className='flex flex-col w-full gap-2'>
          <div className='flex w-full justify-between'>
            <div className='flex flex-col'>
              <PostAuthor />
              <div className='flex gap-2'>
                <Title />
                <ToggleProvider>
                  <ToggleProvider.Trigger>
                    <SettingsButton />
                  </ToggleProvider.Trigger>
                  <ToggleProvider.Target>
                    <UpdateTrackModal track={post} />
                  </ToggleProvider.Target>
                </ToggleProvider>
              </div>
              {currentPlayback?.track.id === post?.id ? (
                ["playing"].includes(currentPlayback.state) ? (
                  <div className='text-sm font-semibold text-primary flex gap-1 items-center animate-pulse'>
                    <AudioLines size='1rem' />
                    Now playing
                  </div>
                ) : currentPlayback.status === "buffering" ? (
                  <div className='text-sm font-semibold text-primary flex gap-1 items-center'>
                    <Spinner size='1rem' />
                    Buffering
                  </div>
                ) : currentPlayback.status === "error" ? (
                  <div className='text-sm font-semibold text-red-500 flex gap-1 items-center'>
                    <TriangleAlert size='1rem' />
                    Error
                  </div>
                ) : null
              ) : null}
            </div>
            <UploadTime />
          </div>
          <div className='flex w-full flex-col mt-auto items-start'>
            <div className='flex gap-1 overflow-x-scroll'>
              <Tag value={post?.genre} size='small' selected={true} />
              <TagList tags={post?.moods} size={"small"} color='secondary' />
            </div>

            <StatsArea />
          </div>
        </div>
      </div>
    </>
  );
}

<div className='flex gap-2 w-full items-center'>
  <AudioPlayer />
</div>;
