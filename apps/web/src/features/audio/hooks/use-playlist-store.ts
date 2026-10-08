import { create } from "zustand";
import { trackToPlayback } from "../../../utils/post-to-playback";
import { TTrackPublic } from "@pondfm/app-shared";
import { TPlayback } from "../../../types/playback";

type PlaylistStoreState = {
  tracks: TTrackPublic[];
  currentIndex: number;
  update: (newTracks: TTrackPublic[]) => void;
  previous: () => TPlayback | null;
  next: () => TPlayback | null;
  updateCurrentIndex: (currentPlayback: TPlayback) => void;
};

export const usePlaylistStore = create<PlaylistStoreState>((set, get) => ({
  tracks: [],
  currentIndex: 0,
  update: (newTracks) =>
    set((state) => {
      return {
        ...state,
        tracks: newTracks,
        currentIndex: 0,
      };
    }),

  previous: () => {
    const { tracks, currentIndex } = get();
    const newIndex = currentIndex - 1;
    set((state) => ({
      ...state,
      currentIndex: newIndex,
    }));
    const previousTrack = tracks[newIndex];
    return previousTrack ? trackToPlayback(previousTrack) : null;
  },

  next: () => {
    const { tracks, currentIndex } = get();
    const newIndex = currentIndex + 1;
    const nexTrack = tracks[newIndex];
    set((state) => ({
      ...state,
      currentIndex: newIndex,
    }));

    return nexTrack ? trackToPlayback(nexTrack) : null;
  },

  updateCurrentIndex: (currentPlayback: TPlayback) =>
    set((state) => ({
      ...state,
      currentIndex: state.tracks.findIndex((t) => t.id === currentPlayback.track.id) || 0,
    })),
}));
