import { loadEnvVariable } from "@pondfm/server-utils";
import {
  IUrlSigner,
  TStreamSignCommand,
  TUploadSignCommand,
} from "./interfaces/url-signer";
import { signCommand } from "@pondfm/crypto";

export class CustomUrlSigner implements IUrlSigner {
  upload = {
    async sign(command: TUploadSignCommand) {
      const { contentType, contentLength, ...rest } = command;
      const c = {
        ...rest,
        clientId: loadEnvVariable("LOCAL_UPLOAD_CLIENT_ID"),
        "content-type": contentType,
        "content-length": contentLength.toString(),
      };

      const secretKey = loadEnvVariable("URL_SIGN_SECRET");
      const customApi = loadEnvVariable("CUSTOM_UPLOAD_API");
      const signature = signCommand(c, secretKey);
      const url = new URL([customApi, "upload", c.key].join("/"));
      url.searchParams.set("X-Client-ID", c.clientId);
      url.searchParams.set("X-Signature", signature);
      return url.toString();
    },
  };

  stream = {
    async sign(command: TStreamSignCommand) {
      const c = {
        ...command,
        clientId: loadEnvVariable("LOCAL_UPLOAD_CLIENT_ID"),
      };
      const secretKey = loadEnvVariable("URL_SIGN_SECRET");
      const signature = signCommand(c, secretKey);
      const destinationUrl = loadEnvVariable("CUSTOM_UPLOAD_API");
      const url = new URL([destinationUrl, "stream", command.key].join("/"));
      url.searchParams.set("X-Client-ID", c.clientId);
      url.searchParams.set("X-Signature", signature);
      return url.toString();
    },
  };
}
