import { createProvider } from '../../../utils/create-provider';
import { usePlayCount } from '../hooks/use-play-count';

export const [PlayCountProvider, usePlayCountContext] = createProvider({
  contextName: 'PlayCountContext',
  hook: usePlayCount,
});
