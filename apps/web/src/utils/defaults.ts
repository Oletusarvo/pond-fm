interface IPlan {
  storage: string;
  unique_listener_threshold: number;
  price: number;
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
      price: 0,
      unique_listener_threshold: 100,
      storage: "150mb",
    },
    pro: {
      price: 200,
      unique_listener_threshold: 1000,
      storage: "5gb",
    },
  },
  url: {
    /**Returns the url to a user's profile with the tab set to "tracks". */
    userTracks: (id: string) => `/user/${id}?tab=tracks`,
  },
};
