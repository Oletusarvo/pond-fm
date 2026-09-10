import { signCommand } from "@pondfm/crypto";
import { IFileDeleter } from "./interfaces/file-deleter";

export class CustomFileDeleter implements IFileDeleter {
  /**Makes a call to the custom upload server to delete all files matching the passed keys. */
  async delete(keys: string[]) {
    try {
      const clientId = process.env.LOCAL_UPLOAD_CLIENT_ID;
      const signature = signCommand(
        {
          clientId,
          key: JSON.stringify(keys.sort()),
        },
        process.env.URL_SIGN_SECRET,
      );

      const signedDeleteUrl = new URL(
        [process.env.CUSTOM_UPLOAD_API, "upload"].join("/"),
      );
      signedDeleteUrl.searchParams.set("X-Signature", signature);
      signedDeleteUrl.searchParams.set("X-Client-ID", clientId);

      const res = await fetch(signedDeleteUrl, {
        method: "DELETE",
        body: JSON.stringify({ keys }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { success: res.ok === true };
    } catch (err) {
      console.log(err.message, err.stack);
      return { success: false };
    }
  }
}
