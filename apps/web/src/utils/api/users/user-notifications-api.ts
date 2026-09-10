import { serviceError, TNotification } from "@pondfm/app-shared";
import { requestBuilder } from "../../request-builder";
import { Api } from "../api";
import { TApiResponse } from "../types";

export class UserNotificationsApi {
  /**Gets the authenticated user's notifications. */
  async get(cursor?: string) {
    const req = requestBuilder.get().includeCredentials().build();
    const url = new URL(Api.withEndpoint(`users/notifications`));
    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }
    const res = await fetch(url, req);
    return await Api.asApiResponse<
      TNotification[],
      typeof serviceError.auth.forbidden | typeof serviceError.auth.unauthorized
    >(res);
  }

  /**Marks the authenticated user's notifications as seen. */
  async markAsSeen() {
    const req = requestBuilder.put().json().includeCredentials().build();
    const res = await fetch(
      Api.withEndpoint(`users/notifications/mark-as-seen`),
      req,
    );
    return await Api.asApiResponse<
      null,
      typeof serviceError.auth.forbidden | typeof serviceError.auth.unauthorized
    >(res);
  }
}
