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
import { HorizontalScrollable } from "../../../components/horizontal-scrollable";

/**The main component responsible for rendering posts. Includes an AudioPlayer, stats and other information.
 * Must be a child of a PostProvider.
 */
export function Post({ ref }: { ref?: React.RefObject<any> }) {
  const { track: post } = useTrackContext();
  const { currentPlayback, togglePlayback, updateCurrentPlayback, updatePlaybackState } =
    usePlaybackContext();
  const isPlaying = currentPlayback?.track.id === post?.id;
  const containerClassName = useClassName(
    "flex py-2 rounded-md w-full flex-col gap-1 items-start transition-colors duration-500 grow-0",
    isPlaying ? "bg-primary/5" : "bg-white",
  );

  const trackId = post?.id;
  const playbackTrackId = currentPlayback?.track.id;
  const onClick = () => {
    if (playbackTrackId !== trackId || currentPlayback?.state === "error") {
      updateCurrentPlayback(trackToPlayback(post));
    }
  };
  return (
    <li ref={ref} className={containerClassName} onClick={onClick}>
      <Content />
    </li>
  );
}

function Content() {
  const { session } = useAuthContext();
  const { track: post } = useTrackContext();
  const { currentPlayback } = usePlaybackContext();

  const ContentBody = ({ children }: React.PropsWithChildren) => {
    return <div className='flex flex-col w-full'>{children}</div>;
  };

  const ContentRow = ({ children, className }: React.ComponentProps<"div">) => {
    const combinedClassName = useClassName("flex w-full justify-between", className);
    return <div className={combinedClassName}>{children}</div>;
  };

  const EditButton = () => {
    return (
      <ToggleProvider>
        <ToggleProvider.Trigger>
          <SettingsButton />
        </ToggleProvider.Trigger>
        <ToggleProvider.Target>
          <UpdateTrackModal track={post} />
        </ToggleProvider.Target>
      </ToggleProvider>
    );
  };

  const PlaybackStatus = () => {
    return currentPlayback?.track.id === post?.id ? (
      ["playing"].includes(currentPlayback.state) ? (
        <div className='text-xs font-semibold text-primary flex gap-1 items-center animate-pulse'>
          <AudioLines size='1rem' />
          Now playing
        </div>
      ) : currentPlayback.state === "buffering" ? (
        <div className='text-xs font-semibold text-primary flex gap-1 items-center'>
          <Spinner size='1rem' />
          Buffering
        </div>
      ) : currentPlayback.state === "rate-limited" ? (
        <div className='text-xs font-semibold text-red-500 flex gap-1 items-center'>
          <TriangleAlert size='1rem' />
          Please slow down! Try again in a minute.
        </div>
      ) : currentPlayback.state === "error" ? (
        <div className='text-xs font-semibold text-red-500 flex gap-1 items-center'>
          <TriangleAlert size='1rem' />
          Error
        </div>
      ) : null
    ) : null;
  };

  return (
    <article className='flex gap-1 flex-1 w-full overflow-hidden items-center'>
      <img src={post?.artwork} className='xs:w-24 xs:h-24 lg:w-32 lg:h-32 rounded-lg' />
      <ContentBody>
        <ContentRow>
          <PostAuthor />
          <UploadTime />
        </ContentRow>
        <ContentRow className='mb-2'>
          <Title />
          <EditButton />
        </ContentRow>

        <ContentRow className='mt-auto'>
          <div className='flex w-full flex-col items-start'>
            <div className='flex flex-col gap-1 items-start'>
              <Tag value={post?.genre} size='small' selected={true} />
              <HorizontalScrollable>
                <TagList tags={post?.moods} size={"small"} color='secondary' />
              </HorizontalScrollable>
            </div>
            <div className='flex w-full justify-between items-center'>
              <StatsArea />
              <PlaybackStatus />
            </div>
          </div>
        </ContentRow>
      </ContentBody>
    </article>
  );
}
