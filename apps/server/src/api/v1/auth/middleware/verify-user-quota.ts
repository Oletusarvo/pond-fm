import { createMiddleware } from "@pondfm/server-utils";
import { tablenames } from "../../../../tablenames";
import { db } from "../../../../db-config";
import { serviceError } from "@pondfm/app-shared";

export const verifyUserQuota = createMiddleware(async (req, res, next) => {
  const settings = await db(tablenames.serviceSettings)
    .select("max_users", "registered_users")
    .first();
  const newUserCount = Number(settings.registered_users) + 1;
  const maxUsers = Number(settings.max_users);
  if (newUserCount > maxUsers) {
    return res.status(409).json({
      error: serviceError.auth.userQuotaExceeded,
    });
  }
  next();
});
