import { serviceError, TSubscriptionRestricted } from "@pondfm/app-shared";
import { requestBuilder } from "../../request-builder";
import { Api } from "../api";
import { TApiResponse } from "../types";

export class UserSubscriptionsApi {
  /**Starts the process to upgrade a users subscription to pro. */
  async upgrade() {
    const req = requestBuilder.patch().includeCredentials().build();
    const res = await fetch(
      Api.withEndpoint("billing/subscriptions/checkout"),
      req,
    );
    return await Api.asApiResponse<
      { checkoutUrl: string },
      typeof serviceError.auth.unauthorized
    >(res);
  }

  /**Cancels the users pro subscription. */
  async cancel() {
    const req = requestBuilder.del().includeCredentials().build();
    const res = await fetch(
      Api.withEndpoint("billing/subscriptions/cancel"),
      req,
    );
    return await Api.asApiResponse<null>(res);
  }

  /**Gets the status of a users subscription. */
  async getStatus() {
    const req = requestBuilder.get().includeCredentials().build();
    const res = await fetch(
      Api.withEndpoint("billing/subscriptions/status"),
      req,
    );
    return await Api.asApiResponse<
      Pick<TSubscriptionRestricted, "status" | "plan_id">,
      typeof serviceError.auth.unauthorized
    >(res);
  }
}
