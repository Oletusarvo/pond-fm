import { usePopulatePlaylistStore } from "../../audio/hooks/use-populate-playlist-store";

export function PopulatesPlaylistStore({ children }: React.PropsWithChildren) {
  usePopulatePlaylistStore();
  return children;
}
