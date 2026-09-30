import { useCallback, useState } from "react";
import { trackToPlayback } from "../../../utils/post-to-playback";
import { useTrackContext } from "../../posts/providers/post-provider";
import { PlayButton } from "../../posts/components/play-button";
import { Waveform } from "../../posts/components/waveform";
import { useEventHandler } from "../../../hooks/use-event-handler";
import { usePlaybackContext } from "../providers/playback-provider";
import { PlaybackTrack } from "../../posts/components/playback-track";

export function AudioPlayer() {
  const { playbackState, togglePlayback, currentPlayback, audioRef, updateCurrentPlayback } =
    usePlaybackContext();
  const playbackTrackId = currentPlayback?.track.id;
  const { track: post } = useTrackContext();
  const postTrackId = post?.id;
  const [playbackPosition, setPlaybackPosition] = useState(() =>
    currentPlayback?.track.id === post?.id ? audioRef.current?.currentTime : 0,
  );

  const onWaveformClicked = (currentTime: number) => {
    if (playbackTrackId === postTrackId) {
      audioRef.current.currentTime = currentTime;
    } else {
      updateCurrentPlayback({
        ...trackToPlayback(post),
        start_position: currentTime,
      });
    }
  };

  const onPlayButtonClicked = async () => {
    if (playbackTrackId === postTrackId) {
      togglePlayback();
    } else {
      updateCurrentPlayback(trackToPlayback(post));
    }
  };

  useEventHandler({
    type: "timeupdate",
    service: audioRef.current,
    handler: (e: any) => {
      if (playbackTrackId === postTrackId) {
        setPlaybackPosition(e.currentTarget.currentTime);
      }
    },
  });

  const playbuttonState =
    currentPlayback && playbackTrackId === postTrackId
      ? currentPlayback.status === "ready"
        ? playbackState
        : currentPlayback.status
      : "paused";
  return (
    <div className='flex gap-2 w-full h-full items-center'>
      <PlayButton state={playbuttonState} onClick={onPlayButtonClicked} />
      <PlaybackTrack
        duration={post?.duration}
        currentPosition={playbackPosition}
        onClicked={onWaveformClicked}
      />
    </div>
  );
}

/*
<Waveform
  waveform={post?.track.waveform}
  duration={post?.track.duration}
  playbackPosition={playbackPosition}
  onWaveformClicked={onWaveformClicked}
/>;*/
