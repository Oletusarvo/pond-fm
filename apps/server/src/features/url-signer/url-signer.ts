import { loadEnvVariable } from "@pondfm/server-utils";
import { AWSUrlSigner } from "./aws-url-signer";
import { CustomUrlSigner } from "./custom-url-signer";
import { IUrlSigner } from "./interfaces/url-signer";

const env = loadEnvVariable("OBJECT_STORE_ENV");
export const urlSigner: IUrlSigner =
  env === "production" ? new AWSUrlSigner() : new CustomUrlSigner();
