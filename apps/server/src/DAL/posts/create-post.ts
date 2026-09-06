import { TPost, TTrack } from "@pondfm/app-shared";
import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { TAuthor } from "@pondfm/app-shared/dist/types/author";

/**Creates a new post. */
export async function createPost(ctx: DBContext, config: {
  track: Pick<TTrack, 'id'>;
  author: Pick<TAuthor, 'id'>;
}) {
  const [post] = await ctx(tablenames.posts).insert({
    track_id: config.track.id, author_id: config.author.id
  } as TPost).returning(['id', 'author_id', 'track_id']) as [Pick<TPost, 'id' | 'author_id' | 'track_id'>];
  return post;
}