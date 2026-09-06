import { serviceError } from "@pondfm/app-shared";
import { requestBuilder } from "../../request-builder";
import { Api } from "../api";

export class TracksCreateApi {
  /**Requests an upload url. */
  async requestUploadUrl(payload: {
    upload: {
      filename: string;
      mimeType: string;
      size: number;
    };
    track: {
      title: string;
      moods: string[];
      genre: string;
    };
  }) {
    const req = requestBuilder
      .body(payload)
      .json()
      .includeCredentials()
      .post()
      .build();
    const res = await fetch(Api.withEndpoint("upload/create"), req);
    return await Api.asApiResponse<
      {
        uploadUrl: string;
        code: string;
      },
      typeof serviceError.auth.unauthorized
    >(res);
  }
  /**Uploads a file to a url. */
  async upload({
    method,
    url,
    file,
    onProgress,
  }: {
    method: string;
    file: File;
    url: string;
    onProgress: (percent: number) => void;
  }) {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.open(method, url);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100;
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Network error"));

      xhr.send(file);
    });
  }
  /**Completes an upload. */
  async complete(code: string) {
    const req = requestBuilder.post().json().includeCredentials().build();
    const res = await fetch(
      Api.withEndpoint(["upload/complete", code].join("/")),
      req,
    );
    return await Api.asApiResponse<null>(res);
  }
}
