module.exports = function constructTrackView(knex, view) {
  view.as(
    knex
      .with("author", (qb) => {
        qb.select(
          "audius_user_id",
          knex.raw("(SELECT JSON_BUILD_OBJECT('id', audius_user_id)) AS json"),
        ).from("auth.user_data");
      })
      .with("required_unique_plays", (qb) => {
        qb.from({ track: "post.track_data" })
          .join(
            { subscription: "billing.subscription_view" },
            "subscription.user_id",
            "track.author_id",
          )
          .select(
            "track.audius_track_id AS track_id",
            "subscription.unique_listeners_threshold AS count",
          );
      })
      .from({ post: "post.post_data" })
      .join({ track: "post.track_data" }, "track.audius_track_id", "post.track_id")
      .join({ rup: "required_unique_plays" }, "rup.track_id", "track.audius_track_id")
      .select(
        "post.id AS post_id",
        "track.audius_track_id",
        "track.author_id AS canonical_author_id",
        "post.author_id AS author_id",
        "track.status",
        "post.created_at",
        "track.updated_at",
        "track.play_count",
        "track.genre_id",
        "track.unique_play_count",
        knex.raw(
          "(SELECT COUNT(*) FROM ?? AS likes WHERE likes.track_id = track.audius_track_id) AS like_count",
          ["post.track_like_data"],
        ),
        knex.raw(
          "(SELECT COUNT(*) - 1 FROM ?? repost WHERE repost.track_id = track.audius_track_id) AS repost_count",
          ["post.post_data"],
        ),
        knex.raw("post.author_id = track.author_id AS is_canonical"),
        knex.raw("rup.count AS required_unique_listener_count"),
        knex.raw("unique_play_count >= rup.count AS is_discovered"),
      ),
  );
};
