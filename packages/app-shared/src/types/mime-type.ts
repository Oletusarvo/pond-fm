import type z from "zod";
import type { mimeTypeSchema } from "../schemas/upload-schema.js";

export type TMimeType = z.infer<typeof mimeTypeSchema>;
