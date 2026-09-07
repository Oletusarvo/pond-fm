import z from "zod";

const uploadStatuses = [
  "active",
  "pending_upload",
  "processing_audio",
  "processing_waveform",
  "failed_upload",
  "deleted",
] as const;

export const uploadStatusSchema = z.enum(uploadStatuses);

export const baseUploadFolderSchema = z.object({
  id: z.uuid(),
  author_id: z.uuid(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

const deletedSchema = baseUploadFolderSchema.extend({
  status: uploadStatusSchema.extract(["deleted"]),
  deleted_at: z.coerce.date(),
});

const activeSchema = baseUploadFolderSchema.extend({
  status: uploadStatusSchema.exclude(["deleted"]),
});

export const uploadFolderSchema = z.discriminatedUnion("status", [
  deletedSchema,
  activeSchema,
]);
