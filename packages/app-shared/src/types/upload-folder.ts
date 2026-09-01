import type { TUploadStatus } from "./upload-status.js";

export type TUploadFolder = {
  id: string;
  author_id: string;
  status: TUploadStatus;
  created_at: string;
  updated_at: string;
}