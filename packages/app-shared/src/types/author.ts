import z from "zod";
import type { authorSchema } from "../schemas/author-schema.js";

export type TAuthor = z.infer<typeof authorSchema>;
