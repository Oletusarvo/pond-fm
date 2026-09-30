module.exports = function constructSubscriptionView(knex, view) {
  view.as(
    knex
      .from({ subscription: "billing.subscription_data" })
      .join({ plan: "billing.plan_data" }, "plan.id", "subscription.plan_id")
      .leftJoin(
        { override: "billing.subscription_quota_override_data" },
        "override.user_id",
        "subscription.user_id",
      )
      .select(
        "subscription.*",
        "override.override_started_at",
        "override.override_expires_at",
        knex.raw(
          "COALESCE(override.unique_listeners_threshold, plan.unique_listeners_threshold) AS unique_listeners_threshold",
        ),
      ),
  );
};
