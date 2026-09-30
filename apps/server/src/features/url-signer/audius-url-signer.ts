import { IUrlSigner, TStreamSignCommand, TUploadSignCommand } from "./interfaces/url-signer";

const ENDPOINT_URL = "https://api.audius.co/v1/";
export class AudiusUrlSigner implements IUrlSigner {
  private withEndpoint(...args: string[]) {
    return [ENDPOINT_URL, ...args].join("/");
  }
  upload = {
    async sign(command: TUploadSignCommand) {
      throw new Error("Audius url signing not implemented!");
    },
  };
  stream = {
    async sign(command: TStreamSignCommand & { audiusUserId: string }) {
      const audiusTrackId = command.key;
      const url = new URL(this.withEndpoint("tracks", audiusTrackId, "stream"));
      url.searchParams.set("user_id", command.audiusUserId);

      const res = await fetch(url);

      if (res.ok) {
        const data = await res.json();
        return data.stream;
      } else {
        throw new Error("Failed to fetch audius stream!");
      }
    },
  };
}
