import { useCallback } from "react";
import { api } from "../utils/api/api";
import { createProvider } from "../utils/create-provider";
import { cancelPrevious } from "../utils/debounce";

export const [CancelableTrackMethodsProvider, useCancelableTrackMethodsContext] = createProvider({
  contextName: "CancelableTrackMethodsContext",
  hook: <TArgs extends any[], TRet>() => {
    return {
      toggleLike: useCallback(
        cancelPrevious(
          async (id: string, isLiked: boolean) =>
            !isLiked ? await api.tracks.like(id) : await api.tracks.unlike(id),
          1000,
        ),
        [],
      ),
      repost: useCallback(
        cancelPrevious(
          async (id: string, isReposted: boolean) =>
            !isReposted ? await api.tracks.repost(id) : await api.tracks.unrepost(id),
          1000,
        ),
        [],
      ),
      follow: useCallback(
        cancelPrevious(
          async (id: string, isFollowed: boolean) =>
            !isFollowed ? await api.users.follow(id) : await api.users.unfollow(id),
          1000,
        ),
        [],
      ),
    };
  },
});
