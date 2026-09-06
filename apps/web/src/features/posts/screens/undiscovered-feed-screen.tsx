import { Sprout } from "lucide-react";
import { PostFeedScreen } from "./feed-screen";
import { api } from "../../../utils/api/api";

export function UndiscoveredFeedScreen() {
  return (
    <PostFeedScreen
      icon={<Sprout />}
      title='Undiscovered'
      description='Browse tracks that have not yet hit their unique listeners threshold.'
      queryFn={async (genres, moods, cursor) =>
        await api.tracks.feed.undiscovered(cursor, genres, moods)
      }
      queryKey={["feed", "undiscovered"]}
    />
  );
}
