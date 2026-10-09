import { useEffect, useRef, useState } from "react";
import { TPlayback } from "../../../types/playback";
import { useEventHandler } from "../../../hooks/use-event-handler";
import { PlaybackReducerState } from "../reducers/playback-reducer";
import { api } from "../../../utils/api/api";
import { usePlaylistStore } from "./use-playlist-store";

export function useAudioPlayer() {
  const [currentPlayback, setCurrentPlayback] = useState<PlaybackReducerState | null>(null);
  const playbackSrc = currentPlayback?.state === "ready" ? currentPlayback.streamUrl : null;
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamSignal = useRef<AbortController>(null);
  const updateCurrentIndex = usePlaylistStore((state) => state.updateCurrentIndex);
  /**Updates the current playback. */
  const updateCurrentPlayback = async (playback: TPlayback | null) => {
    streamSignal.current?.abort();
    streamSignal.current = new AbortController();
    audioRef.current?.pause();

    if (!playback) {
      setCurrentPlayback(null);
      return;
    }

    setCurrentPlayback({
      ...playback,
      state: "buffering",
    });

    //Request a stream token.
    await api.tracks
      .requestStreamUrl(playback.track.id, streamSignal.current.signal)
      .then(async (res) => {
        if (res.success === false) {
          const state = res.status === 429 ? "rate-limited" : "error";
          setCurrentPlayback({
            ...playback,
            state,
          });
          throw new Error("Failed to start stream!");
        }

        const data = res.data;

        setCurrentPlayback({
          ...playback,
          state: "ready",
          streamUrl: data.streamUrl,
        });
      })
      .catch((err) => {
        console.log("Fetching of stream token failed!", err.message);
        setCurrentPlayback({
          ...playback,
          state: "error",
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
    audioRef.current.currentTime = pos;
  };

  const stopPlayback = () => {
    audioRef.current?.pause();
    setCurrentPlayback({
      ...currentPlayback,
      state: "paused",
    });
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

  //Set the initial volume of the audio-tag.
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.25;
    }
  }, [audioRef.current]);

  //Automatically play tracks when they are selected. Must be done here; the hidden audio-tag must be rendered before play is hit.
  useEffect(() => {
    if (currentPlayback?.state === "ready") {
      audioRef.current.currentTime = currentPlayback.start_position || 0;
      onPlay();
      updateCurrentIndex(currentPlayback);
    }
  }, [currentPlayback?.track.id, currentPlayback?.state]);

  useEventHandler({
    service: audioRef.current,
    type: "error",
    handler: (e: any) => {
      setCurrentPlayback({
        ...currentPlayback,
        state: "error",
      });
    },
  });

  return {
    currentPlayback,
    togglePlayback,
    updateCurrentPlayback,
    updatePlaybackState,
    updatePlaybackPosition,
    stopPlayback,
    audioRef,
    playbackSrc,
  };
}
