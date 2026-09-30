export const tablenames = {
  tracks: "post.track_data",
  users: "auth.user_data",
  payments: "billing.payment_data",
  /**@deprecated */
  paymentStatuses: "payment_status",
  /**@deprecated */
  paymentTypes: "payment_type",
  authTokens: "auth.auth_token_data",
  posts: "post.post_data",
  uniqueListeners: "post.unique_listener_data",
  notifications: "notification_data",
  genres: "post.genre_type",
  moods: "post.mood_type",
  trackMoods: "post.mood_data",
  likes: "post.track_like_data",
  followers: "follower_data",
  uploads: "upload.upload_data",
  audio: "upload.audio_data",
  uploadTokens: "upload.upload_token_data",
  plans: "billing.plan_data",
  subscriptions: "billing.subscription_data",
  subscriptionQuotaOverrides: "billing.subscription_quota_override_data",
  serviceSettings: "service_settings_data",
  uploadFolders: "upload.upload_folder_data",
  userUrls: "auth.user_url_data",
  playData: "post.play_data",
  passwordResetSessions: "auth.password_reset_session_data",
  emailUpdateSessions: "auth.email_reset_session_data",
  streamSessions: "post.stream_session_data",
  loginSessions: "auth.login_session_data",
} as const;

export const viewnames = {
  /**
   * Refers to a view combining the track, upload, audio and upload_folder_data.
   */
  tracks: "post.track_view",
  subscriptions: "billing.subscription_view",
  users: "auth.user_view",
  posts: "post.post_view",
} as const;
