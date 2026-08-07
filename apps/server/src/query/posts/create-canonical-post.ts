import { DBContext } from "../../types/db-context";
import { TTrack } from "../../types/track-type";
import { createPost } from "./create-post";
import { createTrackMoods } from "./create-track-tags";
import { createTrack } from "./create-track";
import { Knex } from "knex";

/**Creates a new canonical post from a track; a post where the author is the same as the author of the track. */
export async function createCanonicalPost(ctx: Knex.Transaction, config: {
  track: any,
}) {
  const track = await createTrack(ctx, { track: config.track });
  //Create post
  const post = await createPost(
    ctx,
    {
      post: {
        trackId: track.id,
        authorId: track.author_id,
      }
    },
  );
  return {
    ...post, track,
  };
}