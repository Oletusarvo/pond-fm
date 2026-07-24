import { useMemo, useRef, useState } from 'react';

type UseScrobbleProps = {
  /**Percentage of the full duration at which to send a play count increment. */
  threshold: number;
  /**The duration of the track to observe. */
  duration: number;
  /**Method to fire when a track has been listened to for the required amount. */
  onPlayTimeReached: () => void | Promise<void>;
};

export function useScrobble({ threshold, duration, onPlayTimeReached }: UseScrobbleProps) {
  const [timeListened, setTimeListened] = useState(0);
  const playCounted = useRef(false);

  const targetTime = useMemo(() => {
    return threshold * duration;
  }, [duration, threshold]);

  const updateTimeListened = (t: number) => {
    setTimeListened(prev => prev + t);
    if (timeListened >= targetTime && !playCounted.current) {
      playCounted.current = true;
      onPlayTimeReached();
    }
  };

  return {
    updateTimeListened,
  };
}
