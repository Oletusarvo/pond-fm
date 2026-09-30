import { ChevronDown, ChevronUp } from "lucide-react";
import { usePlaybackTrack } from "../../audio/hooks/use-playback-track";

type PlaybackTrackProps = {
  duration: number;
  currentPosition: number;
  onClicked: (pos: number) => void;
};

export function PlaybackTrack({ duration, currentPosition, onClicked }: PlaybackTrackProps) {
  const { onClicked: onTrackClicked } = usePlaybackTrack({
    duration,
    onTrackClicked: (pos) => onClicked(pos),
  });
  const percentagePlayed = (currentPosition / duration) * 100;
  return (
    <div className='w-full h-8 flex items-center cursor-pointer' onClick={onTrackClicked}>
      <div className='w-full h-1 bg-slate-200 rounded-md overflow-hidden'>
        <div
          className='bg-primary flex h-full transition-all duration-200 rounded-lg justify-end relative'
          style={{
            width: `${percentagePlayed}%`,
          }}
        ></div>
      </div>
    </div>
  );
}
