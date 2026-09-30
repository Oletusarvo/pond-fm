import { useQueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import { useTransition } from "react";
import { TTrackPublic } from "@pondfm/app-shared";

type TrackType = Partial<TTrackPublic>;

type TrackState = {
  tracks: Record<string, TTrackPublic>;
  showRepostModal: boolean;
  getTrack: (trackId: string) => TTrackPublic | undefined;
  setTracks: (newTracks: TTrackPublic[]) => void;
  setIsPending: (state: boolean) => void;
  updateTrack: (trackId: string, data: TrackType) => void;
  deleteTrack: (trackId: string) => void;
};

export const useTrackStore = create<TrackState>((set, get) => ({
  tracks: {},
  showRepostModal: false,
  toggleRepostModal: (newState: boolean) =>
    set((state) => {
      return {
        ...state,
        showRepostModal: newState,
      };
    }),
  setIsPending: (pendingState: boolean) =>
    set((state) => {
      return {
        ...state,
        isPending: pendingState,
      };
    }),
  getTrack: (trackId: string) => get().tracks[trackId],
  deleteTrack: (trackId: string) =>
    set((state) => {
      const newState = { ...state };
      delete newState.tracks[trackId];
      return newState;
    }),
  setTracks: (tracks) =>
    set((state) => {
      return {
        tracks: {
          ...state.tracks,
          ...Object.fromEntries(tracks.map((p) => [p.id, p])),
        },
      };
    }),
  updateTrack: (trackId, newTrack) =>
    set((state) => {
      const oldData = state.tracks[trackId];
      const newData = {
        ...oldData,
        ...newTrack,
      };
      return {
        tracks: {
          ...state.tracks,
          [trackId]: newData,
        },
      };
    }),
}));

export function useTrack(trackId: string) {
  const queryClient = useQueryClient();
  const postStore = useTrackStore();
  const track = postStore.getTrack(trackId);
  const [tansition, startTransition] = useTransition();

  const updateTrack = (newState: TrackType) => {
    postStore.updateTrack(trackId, newState);
    startTransition(() => {
      queryClient.setQueriesData({ queryKey: ["feed"] }, (oldData: any) => {
        if (!oldData) return oldData;
        const newPages = oldData.pages.map((page) => {
          return {
            ...page,
            items: page.items.map((item) => {
              return item.id === trackId
                ? {
                    ...item,
                    ...newState,
                  }
                : item;
            }),
          };
        });

        return {
          ...oldData,
          pages: newPages,
        };
      });
    });
  };
  return {
    track: track,
    updateTrack: updateTrack,
  };
}
