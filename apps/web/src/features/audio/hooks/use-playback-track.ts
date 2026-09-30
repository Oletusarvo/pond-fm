export function usePlaybackTrack({
  duration,
  onTrackClicked,
}: {
  duration: number;
  onTrackClicked: (pos: number) => void;
}) {
  const onClicked = (e: React.MouseEvent<HTMLDivElement>) => {
    const trackRect = e.currentTarget.getBoundingClientRect();

    // Mouse position inside the track
    const mouseXPos = e.clientX - trackRect.left;

    // Clamp between 0 and 1
    const percentage = Math.max(0, Math.min(1, mouseXPos / trackRect.width));
    onTrackClicked(percentage * duration);
  };

  return {
    onClicked,
  };
}
