import { loadEnvVariable } from "@pondfm/server-utils";
import {
  IUrlSigner,
  TStreamSignCommand,
  TUploadSignCommand,
} from "./interfaces/url-signer";
import { signCommand } from "@pondfm/crypto";
import { customUploadConfig } from "../../custom-upload-config";

export class CustomUrlSigner implements IUrlSigner {
  upload = {
    async sign(command: TUploadSignCommand) {
      const { contentType, contentLength, ...rest } = command;
      const c = {
        ...rest,
        clientId: customUploadConfig.client.id,
        "content-type": contentType,
        "content-length": contentLength.toString(),
      };

      const secretKey = customUploadConfig.secret;
      const customApi = customUploadConfig.endpoint;
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
        clientId: customUploadConfig.client.id,
      };
      const secretKey = customUploadConfig.secret;
      const signature = signCommand(c, secretKey);
      const destinationUrl = customUploadConfig.endpoint;
      const url = new URL([destinationUrl, "stream", command.key].join("/"));
      url.searchParams.set("X-Client-ID", c.clientId);
      url.searchParams.set("X-Signature", signature);
      return url.toString();
    },
  };
}
