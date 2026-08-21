import { apiService } from "./api-service";
import { requestBuilder } from "../request-builder";

export async function upgrade(to: string) {
  const req = requestBuilder.patch().json().body({ plan_label: to }).includeCredentials().build();
  return await fetch(this.withEndpoint('billing/subscriptions/checkout'), req);
}
upgrade.bind(apiService);

export async function cancel() {
  const req = requestBuilder.del().includeCredentials().build();
  return await fetch(this.withEndpoint('billing/subscriptions/cancel'), req);
}
cancel.bind(apiService);

export const subscriptions = {
  upgrade, cancel,
}