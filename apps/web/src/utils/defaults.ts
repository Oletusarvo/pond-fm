export const defaults = {
  url: {
    /**Returns the url to a user's profile with the tab set to "tracks". */
    userTracks: (id: string) => `/user/${id}?tab=tracks`,
  },
};
