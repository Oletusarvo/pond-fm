import { createProvider } from "../../../utils/create-provider";
import { usePostActions } from "../../posts/hooks/use-post-actions";
import { useScrobble } from "../hooks/use-scrobble";
import { usePlaybackContext } from "./playback-provider";

export const [ScrobbleProvider, useScrobbleContext] = createProvider({
  contextName: "ScrobbleContext",
  hook: () => {
    const { currentPlayback } = usePlaybackContext();
    const currentTrack = currentPlayback?.track;
    const postActions = usePostActions({ trackId: currentTrack?.id });

    const duration = currentTrack?.duration || 1;
    const service = useScrobble({
      duration,
      threshold: 15 / duration,
      onPlayTimeReached: () => postActions.countPlay(),
    });
    return service;
  },
});
