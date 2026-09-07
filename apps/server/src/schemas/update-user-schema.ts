import { userSchema } from "@pondfm/app-shared";
import z from "zod";

export const updateUserSchema = userSchema.pick({ username: true }).optional();
