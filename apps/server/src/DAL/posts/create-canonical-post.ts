import { createPost } from "./create-post";
import { createTrack } from "./create-track";
import { Knex } from "knex";

/**Creates a new canonical post from a track; a post where the author is the same as the author of the track. */
export async function createCanonicalPost(ctx: Knex.Transaction, config: {
  track: Parameters<typeof createTrack>[1]['track'],
}) {
  const track = await createTrack(ctx, config);
  //Create post
  const post = await createPost(
    ctx,
    {
      track: { id: track.id },
      author: { id: track.author_id },
    },
  );
  return {
    ...post, track,
  };
}