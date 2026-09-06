import { serviceError, TUserPublic } from "@pondfm/app-shared";
import { requestBuilder } from "../../request-builder";
import { Api } from "../api";
import { TApiResponse } from "../types";
import { UserNotificationsApi } from "./user-notifications-api";
import { UserSubscriptionsApi } from "./user-subscriptions-api";

export class UsersApi {
  /**Provides methods related to an authenticated users notifications. */
  notifications = new UserNotificationsApi();
  /**Provides methods related to an authenticated users subscription. */
  subscriptions = new UserSubscriptionsApi();

  async update(payload: { username?: string }) {
    const req = requestBuilder
      .put()
      .body(payload)
      .json()
      .includeCredentials()
      .build();
    const res = await fetch(Api.withEndpoint("users/username"), req);
    return await Api.asApiResponse<
      null,
      typeof serviceError.auth.unauthorized | typeof serviceError.auth.forbidden
    >(res);
  }

  async follow(id: string) {
    const req = requestBuilder.post().includeCredentials().build();
    const res = await fetch(Api.withEndpoint(`users/follow/${id}`), req);
    return await Api.asApiResponse<null, typeof serviceError.auth.unauthorized>(
      res,
    );
  }

  async unfollow(id: string) {
    const req = requestBuilder.post().includeCredentials().build();
    const res = await fetch(Api.withEndpoint(`users/unfollow/${id}`), req);
    return await Api.asApiResponse<null>(res);
  }

  async getFollowers(userId: string, cursor?: string) {
    const req = requestBuilder.get().includeCredentials().build();
    const url = new URL(Api.withEndpoint(`users/followers/${userId}`));
    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }
    const res = await fetch(url, req);
    return await Api.asApiResponse<TUserPublic[]>(res);
  }

  async getFollowing(userId: string, cursor?: string) {
    const req = requestBuilder.get().includeCredentials().build();
    const url = new URL(Api.withEndpoint(`users/following/${userId}`));
    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }
    const res = await fetch(url, req);
    return await Api.asApiResponse<TUserPublic[]>(res);
  }

  async get(id: string) {
    const req = requestBuilder.get().includeCredentials().build();
    const res = await fetch(Api.withEndpoint(`users/${id}`), req);
    return await Api.asApiResponse<TUserPublic>(res);
  }
}
