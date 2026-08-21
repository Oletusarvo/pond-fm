import { requestBuilder } from "../request-builder";
import { apiService } from "./api-service";

async function follow(userId: string) {
  const req = requestBuilder.post().includeCredentials().build();
  return await fetch(this.withEndpoint(`users/follow/${userId}`), req);
}
follow.bind(apiService);

async function unfollow(userId: string) {
  const req = requestBuilder.post().includeCredentials().build();
  return await fetch(this.withEndpoint(`users/unfollow/${userId}`), req);
}
unfollow.bind(apiService);

async function getFollowers(userId: string, cursor?: string) {
  const req = requestBuilder.get().includeCredentials().build();
  const url = new URL(this.withEndpoint(`users/followers/${userId}`));
  if (cursor) {
    url.searchParams.set('cursor', cursor);
  }
  return await fetch(url, req);
}
getFollowers.bind(apiService);

async function getFollowing(userId: string, cursor?: string) {
  const req = requestBuilder.get().includeCredentials().build();
  const url = new URL(this.withEndpoint(`users/following/${userId}`));
  if (cursor) {
    url.searchParams.set('cursor', cursor);
  }
  return await fetch(url, req);
}
getFollowing.bind(apiService);

async function refreshSession(newSession: any) {
  const req = requestBuilder.post().json().body(newSession).includeCredentials().build();
  return await fetch(this.withEndpoint('auth/me/refresh'), req);
}
refreshSession.bind(apiService);

export const users = {
  follow, unfollow, getFollowers, getFollowing, refreshSession
}
