module.exports = function constructTrackView(knex, view) {
  view.as(
    knex
      .with("author", (qb) => {
        qb.select("id", knex.raw("(SELECT JSON_BUILD_OBJECT('id', id)) AS json")).from(
          "auth.user_data",
        );
      })
      .with("required_unique_plays", (qb) => {
        qb.from({ track: "post.track_data" })
          .join(
            { subscription: "billing.subscription_view" },
            "subscription.user_id",
            "track.author_id",
          )
          .select("track.id AS track_id", "subscription.unique_listeners_threshold AS count");
      })
      .with("moods_data", (qb) => {
        qb.select("track_id", knex.raw("JSON_AGG(label) AS moods"))
          .from({ data: "post.mood_data" })
          .join({ type: "post.mood_type" }, "type.id", "data.mood_id")
          .groupBy("track_id");
      })
      .from({ post: "post.post_data" })
      .join({ track: "post.track_data" }, "track.id", "post.track_id")
      .join({ rup: "required_unique_plays" }, "rup.track_id", "track.id")
      .join({ genre: "post.genre_type" }, "genre.id", "track.genre_id")
      .select(
        "post.id AS post_id",
        "track.id",
        "track.author_id AS canonical_author_id",
        "post.author_id AS author_id",
        "track.status",
        "post.created_at",
        "track.updated_at",
        "track.play_count",
        "track.unique_play_count",
        "genre.label as genre",
        knex.raw("(SELECT moods FROM moods_data WHERE track_id = track.id) AS moods"),
        knex.raw(
          "(SELECT COUNT(*) FROM ?? AS likes WHERE likes.track_id = track.id) AS like_count",
          ["post.track_like_data"],
        ),
        knex.raw(
          "(SELECT COUNT(*) - 1 FROM ?? repost WHERE repost.track_id = track.id) AS repost_count",
          ["post.post_data"],
        ),
        knex.raw("post.author_id = track.author_id AS is_canonical"),
        knex.raw("rup.count AS required_unique_listener_count"),
        knex.raw("unique_play_count >= rup.count AS is_discovered"),
      ),
  );
};
