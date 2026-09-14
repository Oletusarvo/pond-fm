module.exports = function constructUserView(knex, view) {
  view.as(
    knex
      .from({ users: "auth.user_data" })
      .select(
        "users.*",
        knex.raw(
          "(SELECT COUNT(*) FROM ?? f WHERE f.followee_id = users.id) AS follower_count",
          ["follower_data"],
        ),
        knex.raw(
          "(SELECT COUNT(*) FROM ?? f WHERE f.follower_id = users.id) AS following_count",
          ["follower_data"],
        ),
        knex.raw(
          "(SELECT JSON_AGG(url) FROM ?? urls WHERE urls.user_id = users.id) AS urls",
          ["auth.user_url_data"],
        ),
      ),
  );
};
