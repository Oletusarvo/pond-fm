import { DeleteObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../s3-config";
import { IFileDeleter } from "./interfaces/file-deleter";

export class AWSFileDeleter implements IFileDeleter {
  /**Makes a call to the AWS cloud storage provider to delete all files matching the provided keys. */
  async delete(keys: string[]) {
    try {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: "audio",
          Delete: {
            Objects: keys.map((key) => ({
              Key: key,
            })),
          },
        }),
      );
      return { success: true };
    } catch (err) {
      console.log(err.message, err.stack);
      return { success: false };
    }
  }
}
