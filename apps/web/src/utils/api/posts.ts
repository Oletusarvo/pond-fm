import { apiService } from "./api-service";
import { requestBuilder } from "../request-builder";

async function getTrack(trackId: string) {
  const req = requestBuilder.get().includeCredentials().build();
  return await fetch(this.withEndpoint('tracks', trackId), req);
}

getTrack.bind(apiService);

export async function deleteTrack(trackId: string) {
  const req = requestBuilder.del().includeCredentials().build();
  return await fetch(this.withEndpoint('tracks', trackId), req);
}

deleteTrack.bind(apiService);

export const posts = {
  getTrack,
  deleteTrack
}