import { useMemo, useRef, useState } from 'react';

type UseScrobbleProps = {
  /**Percentage of the full duration, 0-1, at which to send a play count increment. If set to null, will scrobble at 4 minutes (240 seconds) */
  threshold: number | null;
  /**The duration of the track to observe. */
  duration: number;
  /**Method to fire when a track has been listened to for the required amount. */
  onPlayTimeReached: () => void | Promise<void>;
};

export function useScrobble({ threshold, duration, onPlayTimeReached }: UseScrobbleProps) {
  const timeListenedRef = useRef(0);
  const lastTimeUpdateRef = useRef(null);
  const playCounted = useRef(false);

  const targetTime = useMemo(() => {
    return threshold ? threshold * duration : 240;
  }, [duration, threshold]);

  const updateTimeListened = () => {
    const now = Date.now();

    if (lastTimeUpdateRef.current === null) {
      lastTimeUpdateRef.current = now;
    }

    timeListenedRef.current += (now - lastTimeUpdateRef.current) / 1000;
    lastTimeUpdateRef.current = now;
    if (timeListenedRef.current >= targetTime && !playCounted.current) {
      playCounted.current = true;
      onPlayTimeReached();
    }
  };

  const reset = () => {
    timeListenedRef.current = 0;
    lastTimeUpdateRef.current = null;
    playCounted.current = false;
  };

  const resetLastTimeUpdate = () => (lastTimeUpdateRef.current = null);

  return {
    updateTimeListened,
    resetLastTimeUpdate,
    reset,
  };
}
