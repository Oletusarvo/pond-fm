import { createProvider } from "../../../utils/create-provider";
import { usePostActions } from "../hooks/use-post-actions";

export const [TrackActionProvider, useTrackActionContext] = createProvider({
  contextName: "TrackActionContext",
  hook: usePostActions,
});
