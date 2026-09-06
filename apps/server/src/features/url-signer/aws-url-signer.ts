import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { IUrlSigner, TStreamSignCommand } from "./interfaces/url-signer";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../../s3-config";
import { streamTrackHandler } from "../../api/v1/tracks/handlers/stream-track-handler";

export class AWSUrlSigner implements IUrlSigner {
  upload = {
    async sign(command: Parameters<IUrlSigner['upload']['sign']>[0]) {
      const { key: Key, ...rest } = command;
      const c = new PutObjectCommand({
        ...rest,
        Key,
        Bucket: "audio",
      });

      const uploadUrl = await getSignedUrl(s3, c, {
        expiresIn: 60 * 10,
      });

      return uploadUrl;
    }
  }

  stream = {
    async sign(command: TStreamSignCommand) {
      const c = new GetObjectCommand({
        Bucket: "audio",
        Key: command.key,
      });

      return getSignedUrl(s3, c, {
        expiresIn: 60 * 60,
      });
    }
  }

}