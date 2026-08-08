import { tablenames } from "../../tablenames";
import { DBContext } from "../../types/db-context";
import { selectPost } from "./select/select-post";
import { selectTrack } from "./select/select-track";

import { withAuthor } from "./with/with-author";
import { withMoods } from "./with/with-moods";

export function getPostQuery(ctx: DBContext) {
  const query = ctx.queryBuilder();
  withAuthor(query);
  withMoods(query);
  query
    .join({ author: 'author_json' }, 'author.id', 'post.author_id')
    .join({ track: tablenames.tracks }, 'track.id', 'post.track_id')
    .join({ track_author: 'author_json' }, 'track_author.id', 'track.author_id')
    .join({ track_genre: tablenames.genres }, 'track_genre.id', 'track.genre_id')
    .join({ upload: tablenames.uploads }, 'upload.id', 'track.primary_audio_id')
    .join({ audio: tablenames.audio }, 'audio.upload_id', 'track.primary_audio_id')

  return query;
}