import { userSchema } from "@pondfm/app-shared";
import z from "zod";

export const emailPayloadSchema = userSchema.pick({ email: true });
