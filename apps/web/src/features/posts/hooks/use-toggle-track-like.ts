import { useCancelableFunction } from "../../../hooks/use-cancelable-function";
import { api } from "../../../utils/api/api";
import { TApiErrorResponse, TApiSuccessResponse } from "../../../utils/api/types";

type UseToggleTrackLikeProps = {
  id: string;
  isLiked: boolean;
};

export function useToggleTrackLike({ id, isLiked }: UseToggleTrackLikeProps) {
  return useCancelableFunction(async () => {
    return isLiked === true ? await api.tracks.unlike(id) : await api.tracks.like(id);
  }, 1000);
}
