import { TTrackPublic } from "@pondfm/app-shared";
import { requestBuilder } from "../../request-builder";
import { Api } from "../api";

export class TracksFeedApi {
  private buildFeedUrl(endpoint: string, cursor?: string, genres?: string[], moods?: string[]) {
    const url = new URL(Api.withEndpoint(endpoint));
    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }
    if (genres && genres.length > 0) {
      genres.forEach((g) => url.searchParams.append("genres", g));
    }

    if (moods && moods.length > 0) {
      moods.forEach((m) => url.searchParams.append("moods", m));
    }
    return url;
  }

  /**Returns the discovery feed. */
  async undiscovered(cursor?: string, genres?: string[], moods?: string[]) {
    const req = requestBuilder.get().includeCredentials().build();
    const url = this.buildFeedUrl(`tracks/undiscovered`, cursor, genres, moods);
    const res = await fetch(url, req);
    return await Api.asApiResponse<TTrackPublic[]>(res);
  }

  /**Returns the main feed. */
  async main(cursor?: string, genres?: string[], moods?: string[]) {
    const req = requestBuilder.get().includeCredentials().build();
    const url = this.buildFeedUrl(`tracks/new`, cursor, genres, moods);
    const res = await fetch(url, req);
    return await Api.asApiResponse<TTrackPublic[]>(res);
  }

  async byFollowed(cursor?: string, genres?: string[], moods?: string[]) {
    const req = requestBuilder.get().includeCredentials().build();
    const url = this.buildFeedUrl(`tracks/followed`, cursor, genres, moods);
    const res = await fetch(url, req);
    return await Api.asApiResponse<TTrackPublic[]>(res);
  }

  /**Returns tracks posted by a specific user. */
  async byAuthor(authorId: string, cursor?: string) {
    const req = requestBuilder.get().includeCredentials().build();
    const url = new URL(Api.withEndpoint(`tracks/feed/${authorId}`));
    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }
    const res = await fetch(url, req);
    return await Api.asApiResponse<TTrackPublic[]>(res);
  }

  /**Returns tracks liked by a user. */
  async likedBy(userId: string, cursor?: string) {
    const req = requestBuilder.get().includeCredentials().build();
    const url = this.buildFeedUrl(`tracks/feed/${userId}/liked`, cursor);
    const res = await fetch(url, req);
    return await Api.asApiResponse<TTrackPublic[]>(res);
  }

  /**Returns tracks reposted by a user. */
  async repostedBy(userId: string, cursor?: string) {
    const req = requestBuilder.get().includeCredentials().build();
    const url = this.buildFeedUrl(`tracks/feed/${userId}/reposted`, cursor);
    const res = await fetch(url, req);
    return await Api.asApiResponse<TTrackPublic[]>(res);
  }

  /**Returns tracks where the title or author username matches the search string. */
  async search(cursor?: string, search?: string) {
    const req = requestBuilder.get().includeCredentials().build();
    const url = this.buildFeedUrl(`tracks/feed/search`, cursor);
    if (search) {
      url.searchParams.set("q", search);
    }
    const res = await fetch(url, req);
    return await Api.asApiResponse<TTrackPublic[]>(res);
  }
}
