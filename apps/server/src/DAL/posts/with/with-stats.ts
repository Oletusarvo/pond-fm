import { Knex } from "knex";
import { tablenames, viewnames } from "../../../tablenames";
import { db } from "../../../db-config";
import { TSession } from "@pondfm/app-shared";

export function withStats(query: Knex.QueryBuilder, session?: TSession) {
  return query.with("stats", (q) => {
    q.with("reposted_by_me", (q) => {
      q.from({ track: viewnames.tracks }).select(
        "track.audius_track_id AS track_id",
        session
          ? db.raw(
              `
        EXISTS (
          SELECT 1
          FROM ?? repost
          WHERE repost.track_id = track.audius_track_id
            AND repost.author_id = ?
            AND repost.author_id != track.author_id
        ) AS state
      `,

              [tablenames.posts, session.user.audius_user_id],
            )
          : db.raw("FALSE AS state"),
      );
    });

    q.with("liked_by_me", (q) => {
      q.from({ track: viewnames.tracks }).select(
        "track.audius_track_id as track_id",
        session
          ? db.raw(
              `
        EXISTS (
          SELECT 1
          FROM ?? likes
          WHERE likes.track_id = track.audius_track_id
            AND likes.user_id = ?
        ) AS state
         `,
              [tablenames.likes, session.user.audius_user_id],
            )
          : db.raw("FALSE AS state"),
      );
    });
    q.from({ track: viewnames.tracks })
      .join("liked_by_me", "liked_by_me.track_id", "track.audius_track_id")
      .join("reposted_by_me", "reposted_by_me.track_id", "track.audius_track_id")
      .select(
        "audius_track_id AS track_id",
        db.raw(`
        JSON_BUILD_OBJECT(
          'play_count', track.play_count, 
          'unique_play_count', track.unique_play_count, 
          'like_count', track.like_count,
          'repost_count', track.repost_count,
          'liked_by_me', liked_by_me.state,
          'reposted_by_me', reposted_by_me.state
          ) AS json`),
      );
  });
}
