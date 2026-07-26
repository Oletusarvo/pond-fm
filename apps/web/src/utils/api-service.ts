import { joinStrings } from './join-strings';
import { requestBuilder } from './request-builder';

export class ApiService {
  constructor(private endpoint: string) {}
  private withEndpoint(...args: string[]) {
    return joinStrings([this.endpoint, ...args], '/');
  }

  /**Requests a login magic link. */
  async requestAuthorization(credentials: { email: string; username?: string }) {
    const req = requestBuilder.post().body(credentials).json().includeCredentials().build();
    return await fetch(this.withEndpoint('auth/request-authorization'), req);
  }

  /**Authorizes a user using the auth code obtained after calling login. */
  async authorize(code: string) {
    const req = requestBuilder.post().body({ code }).json().includeCredentials().build();
    return await fetch(this.withEndpoint('auth/authorize'), req);
  }

  /**Creates a new track. */
  async createTrack(payload: FormData) {
    const req = requestBuilder.post().formData(payload).includeCredentials().build();
    return await fetch(this.withEndpoint('tracks'), req);
  }

  /**Likes a track.*/
  async likeTrack(trackId: string) {
    const req = requestBuilder.post().body({ trackId }).json().includeCredentials().build();
    return await fetch(this.withEndpoint('tracks/like'), req);
  }

  /**Unlikes a track. */
  async unlikeTrack(trackId: string) {
    const req = requestBuilder.del().body({ trackId }).json().includeCredentials().build();
    return await fetch(this.withEndpoint('tracks/like'), req);
  }

  /**Reposts a track. */
  async repostTrack(trackId: string) {
    const req = requestBuilder.post().body({ trackId }).json().includeCredentials().build();
    return await fetch(this.withEndpoint('tracks/repost'), req);
  }

  /**Unreposts a track. */
  async unrepostTrack(trackId: string) {
    const req = requestBuilder.del().body({ trackId }).json().includeCredentials().build();
    return await fetch(this.withEndpoint('tracks/repost'), req);
  }

  /**Makes a donation to the platform. */
  async donate(payload: { amountInCents: number }) {
    const req = requestBuilder.post().body(payload).json().includeCredentials().build();
    return await fetch(this.withEndpoint('payments/donate'), req);
  }

  /**Makes a tip to a user. */
  async tip(payload: { recipientId: string; amountInCents: number }) {
    const req = requestBuilder.post().body(payload).json().includeCredentials().build();
    return await fetch(this.withEndpoint('payments/tip'), req);
  }

  /**Updates the authorized user's filter tags. */
  async updateUserTags(tags: string[]) {
    const req = requestBuilder.post().body({ tags }).json().includeCredentials().build();
    return await fetch(this.withEndpoint('users/tags'), req);
  }

  /**Updates the tags of a track. */
  async updateTrackTags(payload: { tags: string[]; trackId: string }) {
    const req = requestBuilder.post().body(payload).json().includeCredentials().build();
    return await fetch(this.withEndpoint('tracks/tags'), req);
  }

  /**Returns the discovery feed. */
  async getDiscoveryFeed(cursor?: string) {
    const req = requestBuilder.get().includeCredentials().build();
    const url = new URL(this.withEndpoint(`tracks/feed/discover`));
    if (cursor) {
      url.searchParams.set('cursor', cursor);
    }
    return await fetch(url, req);
  }

  /**Returns the main feed. */
  async getMainFeed(cursor?: string) {
    const req = requestBuilder.get().includeCredentials().build();
    const url = new URL(this.withEndpoint(`tracks/feed/main`));
    if (cursor) {
      url.searchParams.set('cursor', cursor);
    }
    return await fetch(url, req);
  }

  /**Returns the session info of an authenticated user */
  async me() {
    const req = requestBuilder.get().includeCredentials().build();
    return await fetch(this.withEndpoint('auth/me'), req);
  }

  /**Counts a play by track id. */
  async countPlay(trackId: string) {
    const req = requestBuilder.post().body({ trackId }).json().includeCredentials().build();
    return await fetch(this.withEndpoint('tracks/play'), req);
  }

  /**Logs the user out. */
  async logout() {
    const req = requestBuilder.post().includeCredentials().build();
    return await fetch(this.withEndpoint('auth/logout'), req);
  }
}

/**Provides methods to perform actions on the server. */
export const apiService = new ApiService(import.meta.env.DEV ? 'http://localhost:3002/api/v1' : '');
