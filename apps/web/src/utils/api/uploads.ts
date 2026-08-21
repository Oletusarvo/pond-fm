import { requestBuilder } from "../request-builder";
import { apiService } from "./api-service";

async function requestUploadUrl(payload: { filename: string; mimeType: string; size: number; title: string; moods: string[]; genre: string }) {
  const req = requestBuilder.body(payload).json().includeCredentials().post().build();
  return await fetch(this.withEndpoint('upload/create'), req);
}
requestUploadUrl.bind(apiService);

async function uploadToUrl({
  method,
  url,
  file,
  onProgress
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
uploadToUrl.bind(apiService);

async function completeUpload(code: string) {
  const req = requestBuilder.post().json().includeCredentials().build();
  return await fetch(this.withEndpoint(['upload/complete', code].join('/')), req);
}
completeUpload.bind(apiService);

export const uploads = {
  completeUpload,
  uploadToUrl
}