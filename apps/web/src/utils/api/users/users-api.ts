import { serviceError, TUser, TUserPublic } from "@pondfm/app-shared";
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

  /**Updates a user's profile. */
  async update(payload: Partial<Pick<TUser, "username" | "bio" | "urls">>) {
    const req = requestBuilder
      .put()
      .body(payload)
      .json()
      .includeCredentials()
      .build();
    const res = await fetch(Api.withEndpoint("users"), req);
    return await Api.asApiResponse<
      null,
      typeof serviceError.auth.unauthorized | typeof serviceError.auth.forbidden
    >(res);
  }

  /**Follows a user. */
  async follow(id: string) {
    const req = requestBuilder.post().includeCredentials().build();
    const res = await fetch(Api.withEndpoint(`users/follow/${id}`), req);
    return await Api.asApiResponse<null, typeof serviceError.auth.unauthorized>(
      res,
    );
  }

  /**Unfollows a user. */
  async unfollow(id: string) {
    const req = requestBuilder.post().includeCredentials().build();
    const res = await fetch(Api.withEndpoint(`users/unfollow/${id}`), req);
    return await Api.asApiResponse<null>(res);
  }

  /**Returns the followers of a user. */
  async getFollowers(userId: string, cursor?: string) {
    const req = requestBuilder.get().includeCredentials().build();
    const url = new URL(Api.withEndpoint(`users/followers/${userId}`));
    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }
    const res = await fetch(url, req);
    return await Api.asApiResponse<TUserPublic[]>(res);
  }

  /**Returns the users another follows. */
  async getFollowing(userId: string, cursor?: string) {
    const req = requestBuilder.get().includeCredentials().build();
    const url = new URL(Api.withEndpoint(`users/following/${userId}`));
    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }
    const res = await fetch(url, req);
    return await Api.asApiResponse<TUserPublic[]>(res);
  }

  /**Returns a user. */
  async get(id: string) {
    const req = requestBuilder.get().includeCredentials().build();
    const res = await fetch(Api.withEndpoint(`users/${id}`), req);
    return await Api.asApiResponse<TUserPublic>(res);
  }

  async tip(payload: any) {
    throw new Error("Tipping not implemented!");
  }
}
