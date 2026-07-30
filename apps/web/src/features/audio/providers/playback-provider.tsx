import { useAudioPlayer } from '../hooks/use-audio-player';
import { createProvider } from '../../../utils/create-provider';

export const [PlaybackProvider, usePlaybackContext] = createProvider({
  contextName: 'PlaybackContext',
  hook: useAudioPlayer,
});
