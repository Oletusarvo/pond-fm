/**The number of seconds a track must be played for to trigger a play count. */
export const playCountThresholdSeconds = 15;

/**Returns the play time required to count a play on a track. */
export function getScrobbleThreshold(duration: number) {
  if (duration < playCountThresholdSeconds) {
    return duration;
  } else {
    return playCountThresholdSeconds;
  }
}
