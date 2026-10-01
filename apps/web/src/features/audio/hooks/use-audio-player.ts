import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TPlayback } from "../../../types/playback";
import { useEventHandler } from "../../../hooks/use-event-handler";
import { useActionContext } from "../../../providers/action-provider";
import { PlaybackReducerState } from "../reducers/playback-reducer";
import { api } from "../../../utils/api/api";

export function useAudioPlayer() {
  const [currentPlayback, setCurrentPlayback] = useState<PlaybackReducerState | null>(null);
  const [playbackState, setPlaybackState] = useState<"playing" | "paused" | "buffering" | "error">(
    "paused",
  );
  const playbackSrc = currentPlayback?.status === "ready" ? currentPlayback.streamUrl : null;
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const actionService = useActionContext();

  /**Updates the current playback. */
  const updateCurrentPlayback = async (playback: TPlayback | null) => {
    //Pause playback
    audioRef.current?.pause();
    if (!playback) {
      setCurrentPlayback(null);
      return;
    }
    setCurrentPlayback({
      ...playback,
      status: "buffering",
      state: "paused",
    });

    //Request a stream token.
    await api.tracks
      .requestStreamUrl(playback.track.id)
      .then(async (res) => {
        if (!res.success) {
          throw new Error("Failed to start stream!");
        }

        const data = res.data;

        setCurrentPlayback({
          ...playback,
          status: "ready",
          state: "paused",
          streamUrl: data.streamUrl,
        });
      })
      .catch((err) => {
        console.log("Fetching of stream token failed!", err.message);
        setCurrentPlayback({
          ...playback,
          state: "paused",
          status: "error",
        });
      });
  };

  const updatePlaybackState = (newState: PlaybackReducerState["state"]) => {
    setCurrentPlayback((prev) => {
      return {
        ...prev,
        state: newState,
      };
    });
  };

  const updatePlaybackPosition = (pos: number) => {
    //setPlaybackPosition(pos);
    audioRef.current.currentTime = pos;
  };

  const stopPlayback = () => {
    audioRef.current?.pause();
  };

  /**Toggles the state of the current playback. */
  const togglePlayback = async () => {
    if (!audioRef.current) return;

    if (audioRef.current.paused) {
      await onPlay();
    } else {
      onPause();
    }
  };

  const onPlay = async () => {
    if (!audioRef.current) return;
    await audioRef.current.play();
  };

  const onPause = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25;
    }
  }, [audioRef.current]);

  //Automatically play tracks when they are selected. Must be done here; the hidden audio-tag must be rendered before play is hit.
  useEffect(() => {
    if (currentPlayback?.status === "ready") {
      audioRef.current.currentTime = currentPlayback.start_position || 0;
      onPlay();
    }
  }, [currentPlayback?.track.id, currentPlayback?.status]);

  useEventHandler({
    service: actionService,
    type: "like-toggled",
    handler: (e: CustomEvent) => {
      if (e.detail.id !== currentPlayback?.track.id) return;
      setCurrentPlayback((prev) => {
        return {
          ...prev,
          stats: {
            ...prev.stats,
            liked_by_me: e.detail.state,
          },
        };
      });
    },
  });

  useEventHandler({
    service: audioRef.current,
    type: "error",
    handler: (e: any) => {
      setCurrentPlayback({
        ...currentPlayback,
        status: "error",
      });
    },
  });

  return {
    currentPlayback,
    playbackState,
    togglePlayback,
    updateCurrentPlayback,
    updatePlaybackState,
    updatePlaybackPosition,
    stopPlayback,
    playbackPosition,
    audioRef,
    playbackSrc,
  };
}
