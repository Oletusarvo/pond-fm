import type z from "zod";
import type { TMimeType } from "./mime-type.js";
import type { TUploadFolder } from "./upload-folder.js";
import type { createUploadSchema } from "../schemas/create-upload-schema.js";

export type TUpload = {
  id: string;
  upload_folder_id: TUploadFolder["id"];
  filename: string;
  original_filename: string;
  size_bytes: number;
  mime_type: TMimeType;
  key: string;
};

export type TCreateUpload = z.infer<typeof createUploadSchema>;
