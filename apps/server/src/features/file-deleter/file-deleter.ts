import { loadEnvVariable } from "@pondfm/server-utils";
import { AWSFileDeleter } from "./aws-file-deleter";
import { CustomFileDeleter } from "./custom-file-deleter";
import { IFileDeleter } from "./interfaces/file-deleter";

const env = loadEnvVariable("OBJECT_STORE_ENV", false);
/**Provides methods for deleting files from an external object store. */
export const fileDeleter: IFileDeleter =
  env === "production" ? new AWSFileDeleter() : new CustomFileDeleter();
