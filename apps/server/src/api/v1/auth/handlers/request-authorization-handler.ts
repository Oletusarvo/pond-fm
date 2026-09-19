import { TUser, userSchema } from "@pondfm/app-shared";
import { services } from "../../../../container";
import { db } from "../../../../db-config";
import { emailService } from "../../../../business-services/email-service";

import { serviceError } from "../../../../utils/service-error";
import { createHandler } from "@pondfm/server-utils";
import { TRequest } from "../../../../types/request";
import z from "zod";
import { tablenames } from "../../../../tablenames";

const userNotExistsErrorMessage = "User does not exist!";

const schema = userSchema.pick({ email: true });

/**Creates a new auth token. */
export const requestAuthorizationHandler = createHandler(
  async (req: TRequest<z.infer<typeof schema>>, res) => {
    const { email } = req.body;
    await db.transaction(async (trx) => {
      const user = await trx(tablenames.users)
        .where({ email, status: "active" })
        .select("id")
        .first();
      if (!user) {
        throw new Error(userNotExistsErrorMessage);
      }
      //Create an auth token and a database entry with a temporary code.
      const code = await services.auth.createAuthorizationCode(trx, {
        userId: user.id,
      });

      await emailService.sendMagicLink(email, code.data);
    });
    return res.end();
  },
  (err, res) => {
    const msg = err.message;
    if (msg.includes(userNotExistsErrorMessage)) {
      return res.status(404).json({
        error: "auth:user-not-found",
      });
    }
  },
);
