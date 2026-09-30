import { serviceError, TTrackPublic } from "@pondfm/app-shared";
import { requestBuilder } from "../../request-builder";
import { Api } from "../api";
import { TracksCreateApi } from "./tracks-create-api";
import { TracksFeedApi } from "./tracks-feed-api";

export class TracksApi {
  /**Provides methods related to track feeds. */
  feed = new TracksFeedApi();
  /**Provides methods related to track uploading and creation. */
  create = new TracksCreateApi();

  /**Requests a stream token. */
  async requestStreamUrl(trackId: string) {
    const req = requestBuilder.get().includeCredentials().noStore().build();
    const res = await fetch(Api.withEndpoint(`tracks/${trackId}/stream/url`), req);
    return await Api.asApiResponse<{ streamUrl: string }>(res);
  }

  /**Gets a track. */
  async get(id: string) {
    const req = requestBuilder.get().includeCredentials().build();
    const res = await fetch(Api.withEndpoint("tracks", id), req);
    return await Api.asApiResponse<TTrackPublic>(res);
  }

  /**Deletes a track. */
  async delete(id: string) {
    const req = requestBuilder.delete().includeCredentials().build();
    const res = await fetch(Api.withEndpoint("tracks", id), req);
    return await Api.asApiResponse<
      null,
      typeof serviceError.auth.unauthorized | typeof serviceError.auth.forbidden
    >(res);
  }

  /**Updates a track. */
  async update(id: string, payload: Record<string, any>) {
    const req = requestBuilder.body(payload).json().includeCredentials().put().build();
    const res = await fetch(Api.withEndpoint(`tracks/${id}`), req);
    return await Api.asApiResponse<
      null,
      typeof serviceError.auth.forbidden | typeof serviceError.auth.unauthorized
    >(res);
  }

  /**Gets the main genres of tracks. */
  async getMainGenres() {
    const req = requestBuilder.get().includeCredentials().build();
    const res = await fetch(Api.withEndpoint("tags/genres"), req);
    return await Api.asApiResponse<string[]>(res);
  }

  /**Gets the moods of tracks. */
  async getMoods() {
    const req = requestBuilder.get().includeCredentials().build();
    const res = await fetch(Api.withEndpoint("tags/moods"), req);
    return Api.asApiResponse<string[]>(res);
  }

  /**Counts a play on a track. */
  async countPlay(id: string) {
    const req = requestBuilder.post().includeCredentials().noStore().build();
    const res = await fetch(Api.withEndpoint(`tracks/${id}/play`), req);
    return Api.asApiResponse<null>(res);
  }

  /**Likes a track.*/
  async like(id: string) {
    const req = requestBuilder.post().body({ trackId: id }).json().includeCredentials().build();
    const res = await fetch(Api.withEndpoint("tracks/like"), req);
    return await Api.asApiResponse<null, typeof serviceError.post.duplicateLike>(res);
  }

  /**Unlikes a track. */
  async unlike(id: string) {
    const req = requestBuilder.delete().body({ trackId: id }).json().includeCredentials().build();
    const res = await fetch(Api.withEndpoint("tracks/like"), req);
    return await Api.asApiResponse<null>(res);
  }

  /**Reposts a track. */
  async repost(id: string) {
    const req = requestBuilder.post().body({ trackId: id }).json().includeCredentials().build();
    const res = await fetch(Api.withEndpoint("tracks/repost"), req);
    return await Api.asApiResponse<null, typeof serviceError.post.duplicateRepost>(res);
  }

  /**Unreposts a track. */
  async unrepost(id: string) {
    const req = requestBuilder.delete().body({ trackId: id }).json().includeCredentials().build();
    const res = await fetch(Api.withEndpoint("tracks/repost"), req);
    return await Api.asApiResponse<null>(res);
  }

  /**Imports all tracks to Amphitune that a user has uploaded to Audius. */
  async importFromAudius() {
    const req = requestBuilder.patch().includeCredentials().build();
    const url = new URL(Api.withEndpoint("tracks/audius/import"));
    const res = await fetch(url, req);
    return await Api.asApiResponse(res);
  }
}
