import { Knex } from "knex";
import { db } from "../../../db-config";
import { tablenames } from "../../../tablenames";
import { TSession } from "@pondfm/app-shared";

export function selectPost(query: Knex.QueryBuilder, session?: TSession) {
  query.select(
    'post.id as id',
    'track.status',
    'post.created_at',
    'track.play_count',
    db.raw('(SELECT COUNT(*) FROM ?? AS likes WHERE likes.track_id = track.id) AS like_count', [
      tablenames.likes,
    ]),
    db.raw('(SELECT COUNT(*) - 1 FROM ?? WHERE post_data.track_id = track.id) AS repost_count', [
      tablenames.posts,
    ]),
    db.raw('post.author_id = track_author.id AS is_canonical'),
  );

  if (session) {
    query.select(
      db.raw(
        'EXISTS (SELECT 1 FROM ?? likes WHERE track_id = track.id AND user_id = ?) as liked_by_me',
        [tablenames.likes, session.user.id],
      ),
    );

    query.select(
      db.raw(
        `
              EXISTS (
                SELECT 1 
                FROM ?? repost 
                WHERE repost.track_id = track.id AND repost.author_id = ? AND NOT track.author_id = ?
                ) as reposted_by_me`,
        [tablenames.posts, session.user.id, session.user.id],
      ),
    );
  }
  query.select('author.json as author');
}