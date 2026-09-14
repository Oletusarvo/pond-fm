interface IPlan {
  storage: string;
  unique_listener_threshold: number;
}

interface IDefaults {
  plans: Record<string, IPlan>;
  url: {
    userTracks(id: string): string;
  };
}

export const defaults: IDefaults = {
  plans: {
    free: {
      unique_listener_threshold: 50,
      storage: "150mb",
    },
    pro: {
      unique_listener_threshold: 200,
      storage: "5gb",
    },
  },
  url: {
    /**Returns the url to a user's profile with the tab set to "tracks". */
    userTracks: (id: string) => `/user/${id}?tab=tracks`,
  },
};
