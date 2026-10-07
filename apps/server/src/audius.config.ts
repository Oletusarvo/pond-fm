import { sdk } from "@audius/sdk";
import { loadEnvVariable } from "@pondfm/server-utils";

const API_KEY = loadEnvVariable("AUDIUS_API_KEY");
const API_SECRET = loadEnvVariable("AUDIUS_API_SECRET");
const API_TOKEN = loadEnvVariable("AUDIUS_API_TOKEN");
export const REDIRECT_URI = loadEnvVariable("AUDIUS_REDIRECT_URI");

export const audiusSdk = sdk({
  appName: "Amphitune",
  apiKey: API_KEY,
  apiSecret: API_SECRET,
  bearerToken: API_TOKEN,
  redirectUri: REDIRECT_URI,
});

function withEndpoint(...args: string[]) {
  return ["https://api.audius.co/v1", ...args].join("/");
}

function authorizedRequest(requestInit?: RequestInit) {
  return {
    ...requestInit,
    headers: {
      ...requestInit?.headers,
      Authorization: `Bearer ${API_TOKEN}`,
    },
  };
}

export const audius = {
  tracks: {
    async get(ids: string[]) {
      const url = new URL(withEndpoint("tracks"));
      for (const id of ids) {
        url.searchParams.append("id", id);
      }
      const req = authorizedRequest();
      const res = await fetch(url, req);
      if (!res.ok) {
        const text = await res.text();
        console.log(res.statusText, text);
        throw new Error("Failed to fetch audius tracks!");
      }
      const tracks = await res.json();
      return tracks.data as any[];
    },
    stream: {
      /**Fetches a url from which a track can be streamed. */
      async getUrl(audiusTrackId: string, audiusUserId?: string) {
        const url = new URL(withEndpoint("tracks", audiusTrackId, "stream"));

        url.searchParams.set("api_key", API_KEY);
        url.searchParams.set("no_redirect", "true");
        const req = authorizedRequest();
        const res = await fetch(url, req);

        if (!res.ok) {
          const text = await res.text();
          console.log(res.statusText, text);
          throw new Error("Fetching of stream url failed!");
        }

        const json = await res.json();
        return json.data;
      },
    },
    async like(trackId: string, userId: string) {
      const url = new URL(withEndpoint("tracks", trackId, "favorites"));
      url.searchParams.set("user_id", userId);
      const req = authorizedRequest({ method: "POST" });
      const res = await fetch(url, req);
      if (!res.ok) {
        const text = await res.text();
        console.log(res.statusText, text);
        throw new Error("Failed to like track! " + trackId);
      }
    },
    async unlike(trackId: string, userId: string) {
      const url = new URL(withEndpoint("tracks", trackId, "favorites"));
      url.searchParams.set("user_id", userId);
      const req = authorizedRequest({ method: "DELETE" });
      const res = await fetch(url, req);
      if (!res.ok) {
        const text = await res.text();
        console.log(res.statusText, text);
        throw new Error("Failed to unlike a track! " + trackId);
      }
    },
  },
  /**Contains methods related to users. */
  users: {
    async get(ids: string[]) {
      const url = new URL(withEndpoint("users"));
      for (const id of ids) {
        url.searchParams.append("id", id);
      }
      const req = authorizedRequest();
      const res = await fetch(url, req);
      if (!res.ok) {
        const text = await res.text();
        console.log(res.statusText, text);
        throw new Error("Failed to fetch users");
      }
      const users = await res.json();
      return users.data;
    },
    tracks: {
      /**Counts the number of tracks uploaded by a user by id. */
      async count(userId: string) {
        const url = new URL(withEndpoint("users", userId, "tracks/count"));
        const req = authorizedRequest();
        const res = await fetch(url, req);
        if (!res.ok) {
          const text = await res.text();
          console.log(res.statusText, text);
          throw new Error("Fetching of user track count failed!");
        }
        const count = await res.json();

        return count.data as number;
      },
      /**Gets tracks uploaded by a user by id. */
      async get(userId: string, page: number, limit: number) {
        const url = new URL(withEndpoint("users", userId, "tracks"));
        url.searchParams.set("offset", page.toString());
        url.searchParams.set("limit", limit.toString());
        const req = authorizedRequest();
        const res = await fetch(url, req);

        if (!res.ok) {
          const text = await res.text();
          console.log(res.statusText, text);
          throw new Error("Failed to fetch user tracks from audius!");
        }
        const tracks = await res.json();
        return tracks.data as any[];
      },
    },
  },
  auth: {
    async getToken(code: string, verifier: string) {
      const res = await fetch("https://api.audius.co/v1/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "authorization_code",
          code,
          code_verifier: verifier,
          client_id: API_KEY,
          redirect_uri: REDIRECT_URI,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.log(res.statusText, text);
        throw new Error("Failed to fetch audius token!");
      }
      const token = await res.json();
      return token as {
        access_token: string;
      };
    },
    async me(access_token: string) {
      const res = await fetch("https://api.audius.co/v1/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.log(res.statusText, text);
        throw new Error("Failed to exchange access token for user data!");
      }

      const { data: audiusUser } = await res.json();
      return audiusUser;
    },
  },
};
