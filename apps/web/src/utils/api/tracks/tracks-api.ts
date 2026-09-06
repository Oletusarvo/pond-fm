import { serviceError, TPostPublic, TTrackPublic } from "@pondfm/app-shared";
import { requestBuilder } from "../../request-builder";
import { Api } from "../api";
import { TApiResponse } from "../types";
import { TracksCreateApi } from "./tracks-create-api";
import { TracksFeedApi } from "./tracks-feed-api";

export class TracksApi {
  feed = new TracksFeedApi();
  create = new TracksCreateApi();

  /**Requests a stream token. */
  async requestStreamToken(trackId: string) {
    const req = requestBuilder.get().includeCredentials().noStore().build();
    const res = await fetch(
      Api.withEndpoint(`tracks/${trackId}/stream/token`),
      req,
    );
    return await Api.asApiResponse<{ streamUrl: string }>(res);
  }

  /**Gets a track. */
  async get(id: string) {
    const req = requestBuilder.get().includeCredentials().build();
    const res = await fetch(Api.withEndpoint("tracks", id), req);
    return await Api.asApiResponse<TPostPublic>(res);
  }

  /**Deletes a track. */
  async delete(id: string) {
    const req = requestBuilder.del().includeCredentials().build();
    const res = await fetch(Api.withEndpoint("tracks", id), req);
    return await Api.asApiResponse<
      null,
      typeof serviceError.auth.unauthorized | typeof serviceError.auth.forbidden
    >(res);
  }

  /**Updates a track. */
  async update(id: string, payload: Record<string, any>) {
    const req = requestBuilder
      .body(payload)
      .json()
      .includeCredentials()
      .put()
      .build();
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
    const req = requestBuilder
      .post()
      .body({ trackId: id })
      .json()
      .includeCredentials()
      .build();
    const res = await fetch(Api.withEndpoint("tracks/like"), req);
    return await Api.asApiResponse<
      null,
      typeof serviceError.post.duplicateLike
    >(res);
  }

  /**Unlikes a track. */
  async unlike(id: string) {
    const req = requestBuilder
      .del()
      .body({ trackId: id })
      .json()
      .includeCredentials()
      .build();
    const res = await fetch(Api.withEndpoint("tracks/like"), req);
    return await Api.asApiResponse<null>(res);
  }

  /**Reposts a track. */
  async repost(id: string) {
    const req = requestBuilder
      .post()
      .body({ trackId: id })
      .json()
      .includeCredentials()
      .build();
    const res = await fetch(Api.withEndpoint("tracks/repost"), req);
    return await Api.asApiResponse<
      null,
      typeof serviceError.post.duplicateRepost
    >(res);
  }

  /**Unreposts a track. */
  async unrepost(id: string) {
    const req = requestBuilder
      .del()
      .body({ trackId: id })
      .json()
      .includeCredentials()
      .build();
    const res = await fetch(Api.withEndpoint("tracks/repost"), req);
    return await Api.asApiResponse<null>(res);
  }
}
